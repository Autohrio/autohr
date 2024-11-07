// helper/contextHelper.js

const { TeamMember, User } = require('../models/models');

/**
 * Helper function to detect query intent
 */
function detectQueryIntent(query) {
  const personalKeywords = [
    'my', 'i', 'me', 'mine', 'am i',
    'salary', 'pay', 'compensation', 'earning',
    'leave', 'balance', 'profile', 'status',
    'my supervisor', 'my manager',
    'how much', 'when did i', 'my employee'
  ];

  const departmentKeywords = [
    'department', 'team', 'unit', 'division',
    'who works', 'members in', 'people in',
    'working in', 'assigned to'
  ];

  const employmentKeywords = [
    'hired', 'joined', 'start', 'regular',
    'permanent', 'probation', 'status',
    'employment', 'position', 'role'
  ];

  return {
    isPersonal: personalKeywords.some(keyword => 
      query.toLowerCase().includes(keyword.toLowerCase())
    ),
    isDepartmental: departmentKeywords.some(keyword => 
      query.toLowerCase().includes(keyword.toLowerCase())
    ),
    isEmployment: employmentKeywords.some(keyword => 
      query.toLowerCase().includes(keyword.toLowerCase())
    )
  };
}

/**
 * Transform member data based on privacy rules
 */
function transformMemberData(member, isRequestingUser) {
  return {
    name: member.name,
    employee_id: member.employee_id,
    position: member.position,
    organizational_unit: member.organizational_unit,
    rank: member.rank,
    hire_date: member.hire_date,
    employment_status: member.employment_status,
    supervisor: member.supervisor?.name || 'None',
    // Include sensitive data only for requesting user
    ...(isRequestingUser && {
      regularization_date: member.regularization_date,
      leave_balance: member.leave_balance,
      compensation: member.compensation,
      email: member.email
    })
  };
}

async function findOrLinkTeamMember(workspaceId, userId, email) {
  try {
    // First, try to find TeamMember by userId
    let teamMember = await TeamMember.findOne({
      workspace: workspaceId,
      email: email
    }).populate('supervisor');


    if (!teamMember) {
      // If not found by userId, try to find by email
      teamMember = await TeamMember.findOne({
        workspace: workspaceId,
        email: email
      }).populate('supervisor');

      if (teamMember) {
        // If found by email, update the TeamMember with the userId
        teamMember.user = userId;
        await teamMember.save();
      }
    }

    return teamMember;
  } catch (error) {
    console.error('Error finding/linking team member:', error);
    throw error;
  }
}


/**
 * Get relevant context based on query and user
 */
async function getTeamMemberContext(workspaceId, query, requestingUserId) {
  try {

    const user = await User.findById(requestingUserId);
    if (!user) {
      throw new Error('User not found');
    }


    const requestingTeamMember = await findOrLinkTeamMember(
      workspaceId, 
      requestingUserId,
      user.email
    );
    // No error handling to requestingTeamMember

    // Fetch all team members in workspace with populated supervisor
    // const allTeamMembers = await TeamMember.find({ 
    //   workspace: workspaceId 
    // }).populate('supervisor').lean();
    const allTeamMembers = await TeamMember.find({ 
      workspace: workspaceId 
    }).populate('supervisor').lean();


    // // Find requesting user
    const requestingUser = allTeamMembers.find(member => member.email === user.email);
    if (!requestingUser) {
      throw new Error('Requesting user not found in workspace');
    }

    const queryIntent = detectQueryIntent(query);

    // Transform team members data with privacy rules
    const teamContext = allTeamMembers.map(member => 
      transformMemberData(
        member, 
        member._id.toString() === requestingUserId
      )
    );

    // Build response based on query intent
    if (queryIntent.isPersonal) {
      return {
        type: 'personal',
        requesting_user: requestingTeamMember.name,
        context: {
          user: teamContext.find(m => m.employee_id === requestingTeamMember.employee_id),
          organizational_unit: requestingTeamMember.organizational_unit,
          team_members: teamContext.filter(m => 
            m.organizational_unit === requestingTeamMember.organizational_unit
          ),
          leave_balance: requestingTeamMember.leave_balance,
          compensation: requestingTeamMember.compensation,
        }
      };
    }


    if (queryIntent.isDepartmental) {
      const departmentMembers = teamContext.filter(member => {
        const queryLower = query.toLowerCase();
        return member.organizational_unit.toLowerCase().includes(queryLower) ||
               member.position.toLowerCase().includes(queryLower);
      });

      return {
        type: 'department',
        requesting_user: requestingUser.name,
        context: {
          members: departmentMembers,
          total_members: departmentMembers.length,
          departments: [...new Set(teamContext.map(m => m.organizational_unit))]
        }
      };
    }

    // Default context for general queries
    return {
      type: 'general',
      requesting_user: requestingUser.name,
      context: {
        organizational_unit: requestingUser.organizational_unit,
        team_members: teamContext,
        departments: [...new Set(teamContext.map(m => m.organizational_unit))]
      }
    };

  } catch (error) {
    console.error('Error getting team member context:', error);
    return {
      type: 'error',
      error: error.message
    };
  }
}

/**
 * Generate system message for AI based on context
 */
function generateSystemMessage(contextResult) {
  const baseInstructions = `
You are an HR assistant helping ${contextResult.requesting_user}.

Important Guidelines:
1. Only discuss compensation/salary information if it's about the requesting user
2. Never reveal other employees' private information (salary, leave balance, etc.)
3. You can discuss public information like names, positions, and departments
4. Be helpful but maintain confidentiality
5. If asked about another employee's private information, politely explain that you can't disclose that information
`;

  const contextTypeMessages = {
    personal: `
The user is asking about their personal information. You can:
- Discuss their salary and compensation details
- Share their leave balances and employment information
- Provide their employment history and status
Remember: Only share personal information for the requesting user.
`,
    
    department: `
The user is asking about departmental information. You can:
- Share department structures and team compositions
- Discuss reporting relationships
- Provide public information about team members
Remember: Don't share any private or sensitive information about individuals.
`,
    
    general: `
This is a general query. You should:
- Provide relevant organizational information
- Share public data about departments and positions
- Keep responses focused on public information
Remember: When in doubt, err on the side of privacy.
`,
    
    error: `
There was an error retrieving context. You should:
- Provide only general policy information
- Ask the user to contact HR for specific information
- Don't make assumptions about user details
`
  };

  return `${baseInstructions}\n${contextTypeMessages[contextResult.type] || contextTypeMessages.general}`;
}

/**
 * Update chat context with system message and privacy controls
 */
async function updateChatContext(workspaceId, message, requestingUserId) {
  const contextResult = await getTeamMemberContext(workspaceId, message, requestingUserId);
  const systemMessage = generateSystemMessage(contextResult);

  return {
    systemMessage,
    context: contextResult.context,
    type: contextResult.type
  };
}

module.exports = {
  findOrLinkTeamMember,
  getTeamMemberContext,
  updateChatContext,
  detectQueryIntent  // Exported for testing
};