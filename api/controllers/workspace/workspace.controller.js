const { Workspace, User } = require('../../models/models');

// Create a new workspace
exports.createWorkspace = async (req, res) => {
  try {
    const workspace = new Workspace(req.body);
    await workspace.save();

    // Add workspace to user's workspaces
    const user = await User.findOne({ email: workspace.owner_email });
    if (user) {
      user.workspaces.push(workspace._id);
      await user.save();
    }

    res.status(201).json(workspace);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all workspaces
exports.getWorkspaces = async (req, res) => {
  try {
    const workspaces = await Workspace.find();
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