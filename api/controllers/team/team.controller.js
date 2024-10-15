const { Team, Workspace, TeamMember } = require('../../models/models');

// Create a new team
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

// Add a member to team
exports.addMemberToTeam = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) return res.status(404).json({ message: 'Team not found' });
    
    const newMember = new TeamMember(req.body);
    await newMember.save();
    
    team.members.push(newMember._id);
    await team.save();
    
    res.status(201).json(newMember);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Remove a member from team
exports.removeMemberFromTeam = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) return res.status(404).json({ message: 'Team not found' });
    
    team.members = team.members.filter(m => m.toString() !== req.params.memberId);
    await team.save();
    
    // Optionally, delete the TeamMember document if it's not referenced elsewhere
    await TeamMember.findByIdAndDelete(req.params.memberId);
    
    res.json({ message: 'Team member removed successfully' });
  } catch (error) {
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