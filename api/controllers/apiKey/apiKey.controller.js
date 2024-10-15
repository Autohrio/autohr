const { APIKey, Workspace } = require('../../models/models');
const crypto = require('crypto');

// Generate a new API key
function generateApiKey() {
  return crypto.randomBytes(32).toString('hex');
}

// Create a new API key
exports.createApiKey = async (req, res) => {
  try {
    const { workspaceId, name } = req.body;
    const apiKey = new APIKey({
      name,
      api_key: generateApiKey(),
      created_at: new Date()
    });
    await apiKey.save();

    // Add API key to workspace if workspaceId is provided
    if (workspaceId) {
      const workspace = await Workspace.findById(workspaceId);
      if (workspace) {
        workspace.apiKeys.push(apiKey._id);
        await workspace.save();
      }
    }

    res.status(201).json(apiKey);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all API keys
exports.getAllApiKeys = async (req, res) => {
  try {
    const apiKeys = await APIKey.find().select('-api_key');
    res.json(apiKeys);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single API key by ID
exports.getApiKeyById = async (req, res) => {
  try {
    const apiKey = await APIKey.findById(req.params.id).select('-api_key');
    if (!apiKey) return res.status(404).json({ message: 'API key not found' });
    res.json(apiKey);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update an API key (only name can be updated)
exports.updateApiKey = async (req, res) => {
  try {
    const { name } = req.body;
    const apiKey = await APIKey.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true, runValidators: true }
    ).select('-api_key');
    if (!apiKey) return res.status(404).json({ message: 'API key not found' });
    res.json(apiKey);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete an API key
exports.deleteApiKey = async (req, res) => {
  try {
    const apiKey = await APIKey.findByIdAndDelete(req.params.id);
    if (!apiKey) return res.status(404).json({ message: 'API key not found' });

    // Remove API key from all workspaces that reference it
    await Workspace.updateMany(
      { apiKeys: apiKey._id },
      { $pull: { apiKeys: apiKey._id } }
    );

    res.json({ message: 'API key deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get API keys by workspace
exports.getApiKeysByWorkspace = async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.workspaceId).populate({
      path: 'apiKeys',
      select: '-api_key'
    });
    if (!workspace) return res.status(404).json({ message: 'Workspace not found' });
    res.json(workspace.apiKeys);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Regenerate API key
exports.regenerateApiKey = async (req, res) => {
  try {
    const apiKey = await APIKey.findById(req.params.id);
    if (!apiKey) return res.status(404).json({ message: 'API key not found' });

    apiKey.api_key = generateApiKey();
    await apiKey.save();

    res.json({ message: 'API key regenerated successfully', new_api_key: apiKey.api_key });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Validate API key
exports.validateApiKey = async (req, res) => {
  try {
    const { api_key } = req.body;
    const apiKey = await APIKey.findOne({ api_key });
    if (!apiKey) return res.status(401).json({ message: 'Invalid API key' });
    res.json({ message: 'Valid API key', name: apiKey.name });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get API key usage statistics (mock implementation)
exports.getApiKeyUsageStats = async (req, res) => {
  try {
    const apiKey = await APIKey.findById(req.params.id).select('-api_key');
    if (!apiKey) return res.status(404).json({ message: 'API key not found' });

    // Mock statistics - in a real application, you would fetch actual usage data
    const mockStats = {
      totalRequests: Math.floor(Math.random() * 10000),
      lastUsed: new Date(Date.now() - Math.floor(Math.random() * 1000000000)),
      avgRequestsPerDay: Math.floor(Math.random() * 100)
    };

    res.json({ apiKey, stats: mockStats });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};