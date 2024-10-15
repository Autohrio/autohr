const { Compliance, Workspace } = require('../../models/models');

// Create a new compliance document
exports.createCompliance = async (req, res) => {
  try {
    const { workspaceId, ...complianceData } = req.body;
    const compliance = new Compliance(complianceData);
    await compliance.save();

    // Add compliance to workspace if workspaceId is provided
    if (workspaceId) {
      const workspace = await Workspace.findById(workspaceId);
      if (workspace) {
        workspace.compliances.push(compliance._id);
        await workspace.save();
      }
    }

    res.status(201).json(compliance);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all compliance documents
exports.getAllCompliances = async (req, res) => {
  try {
    const compliances = await Compliance.find();
    res.json(compliances);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single compliance document by ID
exports.getComplianceById = async (req, res) => {
  try {
    const compliance = await Compliance.findById(req.params.id);
    if (!compliance) return res.status(404).json({ message: 'Compliance document not found' });
    res.json(compliance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a compliance document
exports.updateCompliance = async (req, res) => {
  try {
    const compliance = await Compliance.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!compliance) return res.status(404).json({ message: 'Compliance document not found' });
    res.json(compliance);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a compliance document
exports.deleteCompliance = async (req, res) => {
  try {
    const compliance = await Compliance.findByIdAndDelete(req.params.id);
    if (!compliance) return res.status(404).json({ message: 'Compliance document not found' });

    // Remove compliance from all workspaces that reference it
    await Workspace.updateMany(
      { compliances: compliance._id },
      { $pull: { compliances: compliance._id } }
    );

    res.json({ message: 'Compliance document deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get compliances by workspace
exports.getCompliancesByWorkspace = async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.workspaceId).populate('compliances');
    if (!workspace) return res.status(404).json({ message: 'Workspace not found' });
    res.json(workspace.compliances);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add compliance to workspace
exports.addComplianceToWorkspace = async (req, res) => {
  try {
    const { workspaceId, complianceId } = req.params;
    const workspace = await Workspace.findById(workspaceId);
    const compliance = await Compliance.findById(complianceId);

    if (!workspace) return res.status(404).json({ message: 'Workspace not found' });
    if (!compliance) return res.status(404).json({ message: 'Compliance document not found' });

    if (!workspace.compliances.includes(complianceId)) {
      workspace.compliances.push(complianceId);
      await workspace.save();
    }

    res.json(workspace);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Remove compliance from workspace
exports.removeComplianceFromWorkspace = async (req, res) => {
  try {
    const { workspaceId, complianceId } = req.params;
    const workspace = await Workspace.findById(workspaceId);

    if (!workspace) return res.status(404).json({ message: 'Workspace not found' });

    workspace.compliances = workspace.compliances.filter(c => c.toString() !== complianceId);
    await workspace.save();

    res.json(workspace);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Search compliances by content
exports.searchCompliances = async (req, res) => {
  try {
    const { query } = req.query;
    const compliances = await Compliance.find({ content: { $regex: query, $options: 'i' } });
    res.json(compliances);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get compliance status for a workspace
exports.getComplianceStatus = async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.workspaceId).populate('compliances');
    if (!workspace) return res.status(404).json({ message: 'Workspace not found' });

    const totalCompliances = workspace.compliances.length;
    const completedCompliances = workspace.compliances.filter(c => c.status === 'completed').length;
    const complianceRate = totalCompliances > 0 ? (completedCompliances / totalCompliances) * 100 : 0;

    res.json({
      totalCompliances,
      completedCompliances,
      complianceRate: complianceRate.toFixed(2) + '%'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};