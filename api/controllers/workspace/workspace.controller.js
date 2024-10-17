const { Workspace, User, Team, TeamMember, Onboarding, Email, Settings  } = require('../../models/models');

// Create a new workspace
// Step 1. create Workspace
// step 2. link the workspace to the user by pushing it to user.workspaces
// step 3. create a team, add user to that team as owner
// Create a new workspace
exports.createWorkspace = async (req, res) => {
  try {
    const { name, owner_email } = req.body;

    // Step 1: Create Workspace
    const workspace = new Workspace({
      name,
      owner_email
    });
    await workspace.save();

    // Step 2: Link the workspace to the user
    const user = await User.findOne({ email: owner_email });
    if (!user) {
      throw new Error('User not found');
    }
    user.workspaces.push(workspace._id);
    await user.save();

    // Step 3: Create a TeamMember entry for the user
    const teamMember = new TeamMember({
      name: user.name,
      role: 'owner',
      email: user.email,
      workspace: workspace._id
    });
    await teamMember.save();

    // Step 4: Create a team and add the TeamMember
    const team = new Team({
      name: `${workspace.name} Team`,
      workspace: workspace._id,
      members: [teamMember._id]
    });
    await team.save();

    // Step 5: Update TeamMember with the team
    teamMember.teams.push(team._id);
    await teamMember.save();

    // Step 6: Add team to workspace
    workspace.teams.push(team._id);

    // Step 7: Create Onboarding for the workspace
    const onboarding = new Onboarding({
      workspace: workspace._id,
      candidates: []
    });
    await onboarding.save();
    workspace.onboardings = onboarding._id;

    // Step 8: Create Email configuration for the workspace
    const email = new Email({
      workspace: workspace._id,
      smtp_config: {
        host: 'smtp.mail.com',
        port: '465',
        username: 'smtp_username',
        password: 'smtp_password',
        fromEmail: 'demo@autohr.dev'
      },
      templates: {
        offer_template: '',
        rejection_template: ''
      }
    });
    await email.save();
    workspace.emails.push(email._id);

    // Step 9: Create Settings for the workspace
    const settings = new Settings({
      workspace: workspace._id,
      preferred_language: 'en',
      notifications_enabled: false
    });
    await settings.save();
    workspace.settings = settings._id;

    // Save the updated workspace
    await workspace.save();

    res.status(201).json(workspace);
  } catch (error) {
    console.error('Error in createWorkspace:', error);
    res.status(400).json({ message: error.message });
  }
};

// Get all workspaces
exports.getWorkspaces = async (req, res) => {
  try {
    const owner_email = req.body.owner_email;
    const workspaces = await Workspace.find({ owner_email });
    res.json(workspaces);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single workspace by ID
exports.getWorkspaceById = async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.id);
    if (!workspace) return res.status(404).json({ message: 'Workspace not found' });
    res.json(workspace);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a workspace
exports.updateWorkspace = async (req, res) => {
  try {
    const workspace = await Workspace.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!workspace) return res.status(404).json({ message: 'Workspace not found' });
    res.json(workspace);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a workspace
exports.deleteWorkspace = async (req, res) => {
  try {
    const workspace = await Workspace.findByIdAndDelete(req.params.id);
    if (!workspace) return res.status(404).json({ message: 'Workspace not found' });

    // Remove workspace from user's workspaces
    const user = await User.findOne({ email: workspace.owner_email });
    if (user) {
      user.workspaces = user.workspaces.filter(w => w.toString() !== workspace._id.toString());
      await user.save();
    }

    res.json({ message: 'Workspace deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get workspace teams
exports.getWorkspaceTeams = async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.id).populate('teams');
    if (!workspace) return res.status(404).json({ message: 'Workspace not found' });
    res.json(workspace.teams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add a team to workspace
exports.addTeamToWorkspace = async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.id);
    if (!workspace) return res.status(404).json({ message: 'Workspace not found' });
    
    workspace.teams.push(req.body.teamId);
    await workspace.save();
    
    res.json(workspace);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Remove a team from workspace
exports.removeTeamFromWorkspace = async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.id);
    if (!workspace) return res.status(404).json({ message: 'Workspace not found' });
    
    workspace.teams = workspace.teams.filter(t => t.toString() !== req.params.teamId);
    await workspace.save();
    
    res.json(workspace);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get workspace policies
exports.getWorkspacePolicies = async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.id).populate('policies');
    if (!workspace) return res.status(404).json({ message: 'Workspace not found' });
    res.json(workspace.policies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add a policy to workspace
exports.addPolicyToWorkspace = async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.id);
    if (!workspace) return res.status(404).json({ message: 'Workspace not found' });
    
    workspace.policies.push(req.body.policyId);
    await workspace.save();
    
    res.json(workspace);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get workspace billing
exports.getWorkspaceBilling = async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.id).populate('billing');
    if (!workspace) return res.status(404).json({ message: 'Workspace not found' });
    if (!workspace.billing) return res.status(404).json({ message: 'Workspace billing not found' });
    
    res.json(workspace.billing);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update workspace billing
exports.updateWorkspaceBilling = async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.id);
    if (!workspace) return res.status(404).json({ message: 'Workspace not found' });
    
    workspace.billing = req.body.billingId;
    await workspace.save();
    
    res.json(workspace);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};