const { Policy, Workspace } = require('../../models/models');

// Create a new policy
exports.createPolicy = async (req, res) => {
  try {
    const { workspaceId, ...policyData } = req.body;
    const policy = new Policy(policyData);
    await policy.save();

    // Add policy to workspace if workspaceId is provided
    if (workspaceId) {
      const workspace = await Workspace.findById(workspaceId);
      if (workspace) {
        workspace.policies.push(policy._id);
        await workspace.save();
      }
    }

    res.status(201).json(policy);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all policies
exports.getAllPolicies = async (req, res) => {
  try {
    const policies = await Policy.find();
    res.json(policies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single policy by ID
exports.getPolicyById = async (req, res) => {
  try {
    const policy = await Policy.findById(req.params.id);
    if (!policy) return res.status(404).json({ message: 'Policy not found' });
    res.json(policy);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a policy
exports.updatePolicy = async (req, res) => {
  try {
    const policy = await Policy.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!policy) return res.status(404).json({ message: 'Policy not found' });
    res.json(policy);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a policy
exports.deletePolicy = async (req, res) => {
  try {
    const policy = await Policy.findByIdAndDelete(req.params.id);
    if (!policy) return res.status(404).json({ message: 'Policy not found' });

    // Remove policy from all workspaces that reference it
    await Workspace.updateMany(
      { policies: policy._id },
      { $pull: { policies: policy._id } }
    );

    res.json({ message: 'Policy deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get policies by workspace
exports.getPoliciesByWorkspace = async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.workspaceId).populate('policies');
    if (!workspace) return res.status(404).json({ message: 'Workspace not found' });
    res.json(workspace.policies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add policy to workspace
exports.addPolicyToWorkspace = async (req, res) => {
  try {
    const { workspaceId, policyId } = req.params;
    const workspace = await Workspace.findById(workspaceId);
    const policy = await Policy.findById(policyId);

    if (!workspace) return res.status(404).json({ message: 'Workspace not found' });
    if (!policy) return res.status(404).json({ message: 'Policy not found' });

    if (!workspace.policies.includes(policyId)) {
      workspace.policies.push(policyId);
      await workspace.save();
    }

    res.json(workspace);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Remove policy from workspace
exports.removePolicyFromWorkspace = async (req, res) => {
  try {
    const { workspaceId, policyId } = req.params;
    const workspace = await Workspace.findById(workspaceId);

    if (!workspace) return res.status(404).json({ message: 'Workspace not found' });

    workspace.policies = workspace.policies.filter(p => p.toString() !== policyId);
    await workspace.save();

    res.json(workspace);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Search policies by content
exports.searchPolicies = async (req, res) => {
  try {
    const { query } = req.query;
    const policies = await Policy.find({ content: { $regex: query, $options: 'i' } });
    res.json(policies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};