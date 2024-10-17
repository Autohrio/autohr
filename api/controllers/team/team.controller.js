const { Team, Workspace, TeamMember } = require('../../models/models');
const mongoose = require('mongoose');
// Create a new team (re-validate the the controller/ may get deprecated)
exports.createTeam = async (req, res) => {
  try {
    const { workspaceId, ...teamData } = req.body;
    const team = new Team(teamData);
    await team.save();

    // Add team to workspace
    if (workspaceId) {
      const workspace = await Workspace.findById(workspaceId);
      if (workspace) {
        workspace.teams.push(team._id);
        await workspace.save();
      }
    }

    res.status(201).json(team);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all teams
exports.getTeams = async (req, res) => {
  try {
    const teams = await Team.find();
    res.json(teams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single team by ID
exports.getTeamById = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) return res.status(404).json({ message: 'Team not found' });
    res.json(team);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a team
exports.updateTeam = async (req, res) => {
  try {
    const team = await Team.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!team) return res.status(404).json({ message: 'Team not found' });
    res.json(team);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a team
exports.deleteTeam = async (req, res) => {
  try {
    const team = await Team.findByIdAndDelete(req.params.id);
    if (!team) return res.status(404).json({ message: 'Team not found' });

    // Remove team from workspace
    await Workspace.updateMany(
      { teams: team._id },
      { $pull: { teams: team._id } }
    );

    res.json({ message: 'Team deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get team members
exports.getTeamMembers = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id).populate('members');
    if (!team) return res.status(404).json({ message: 'Team not found' });
    res.json(team.members);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTeamMembersByWorkspace = async (req, res) => {
  try {
    const { workspaceId } = req.params; // Assuming the workspace ID is passed as a route parameter

    // Find all team members for the given workspace
    const teamMembers = await TeamMember.find({ workspace: workspaceId })
      .select('name role email occupation') // Select only the fields you want to return
      .populate({
        path: 'teams',
        select: 'name', // Only populate the team name
      });

    if (!teamMembers.length) {
      return res.status(404).json({ message: 'No team members found for this workspace' });
    }

    res.status(200).json({
      message: 'Team members retrieved successfully',
      members: teamMembers
    });
  } catch (error) {
    console.error('Error in getTeamMembersByWorkspace:', error);
    res.status(500).json({ message: error.message });
  }
};

// Add a member to team (Approved)
// POST /teams/:teamId/members 
// @params: { teamId }
// @payload: { name, email, role, occupation, workspace }
exports.addMemberToTeam = async (req, res) => {
  try {
    const { teamId } = req.params;
    const { name, email, role, occupation } = req.body;

    // Validate teamId
    if (!mongoose.Types.ObjectId.isValid(teamId)) {
      return res.status(400).json({ message: 'Invalid team ID' });
    }

    // Find the team
    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    // Find the workspace associated with the team
    const workspace = await Workspace.findById(team.workspace);
    if (!workspace) {
      return res.status(404).json({ message: 'Workspace not found' });
    }

    // Check if the member already exists in the workspace
    let teamMember = await TeamMember.findOne({ email, workspace: workspace._id });

    if (teamMember) {
      // If the member exists, check if they're already in the team
      if (team.members.includes(teamMember._id)) {
        return res.status(400).json({ message: 'Member already exists in this team' });
      }
    } else {
      // If the member doesn't exist, create a new TeamMember
      teamMember = new TeamMember({
        name,
        email,
        role,
        occupation,
        workspace: workspace._id
      });
      await teamMember.save();
    }

    // Add the member to the team
    team.members.push(teamMember._id);
    await team.save();

    // Add the team to the member's teams array
    teamMember.teams.push(team._id);
    await teamMember.save();

    res.status(201).json({
      message: 'Member added to team successfully',
      members: teamMember
    });
  } catch (error) {
    console.error('Error in addMemberToTeam:', error);
    res.status(400).json({ message: error.message });
  }
};

// Remove a member from team
exports.removeMemberFromTeam = async (req, res) => {
  try {
    const { teamId, memberId } = req.params;

    // Validate IDs
    if (!mongoose.Types.ObjectId.isValid(teamId) || !mongoose.Types.ObjectId.isValid(memberId)) {
      return res.status(400).json({ message: 'Invalid team ID or member ID' });
    }

    // Find the team
    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    // Find the team member
    const teamMember = await TeamMember.findById(memberId);
    if (!teamMember) {
      return res.status(404).json({ message: 'Team member not found' });
    }

    // Check if the member is in the team
    if (!team.members.includes(memberId)) {
      return res.status(400).json({ message: 'Member is not in this team' });
    }

    // Remove the member from the team
    team.members = team.members.filter(m => m.toString() !== memberId);
    await team.save();

    // Remove the team from the member's teams array
    teamMember.teams = teamMember.teams.filter(t => t.toString() !== teamId);
    await teamMember.save();

    // If the member is not in any teams, optionally delete the TeamMember document
    if (teamMember.teams.length === 0) {
      await TeamMember.findByIdAndDelete(memberId);
      res.json({ message: 'Team member removed successfully and deleted from the system' });
    } else {
      res.json({ message: 'Team member removed successfully from the team' });
    }

  } catch (error) {
    console.error('Error in removeMemberFromTeam:', error);
    res.status(400).json({ message: error.message });
  }
};

// Update team member role
exports.updateTeamMemberRole = async (req, res) => {
  try {
    const { role } = req.body;
    const teamMember = await TeamMember.findByIdAndUpdate(
      req.params.memberId,
      { role },
      { new: true, runValidators: true }
    );
    if (!teamMember) return res.status(404).json({ message: 'Team member not found' });
    res.json(teamMember);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get teams by workspace
exports.getTeamsByWorkspace = async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.workspaceId).populate('teams');
    if (!workspace) return res.status(404).json({ message: 'Workspace not found' });
    res.json(workspace.teams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};