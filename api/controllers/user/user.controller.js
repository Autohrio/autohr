const { User } = require('../../models/models');

// Create a new user
exports.createUser = async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single user by email
exports.getUserByEmail = async (req, res) => {
  try {
    const email = req.body.email

    const user = await User.findOne({ email: email });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a user
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a user
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user's workspaces
exports.getUserWorkspaces = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('workspaces');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user.workspaces);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add a workspace to user
exports.addWorkspaceToUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    user.workspaces.push(req.body.workspaceId);
    await user.save();
    
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Remove a workspace from user
exports.removeWorkspaceFromUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    user.workspaces = user.workspaces.filter(w => w.toString() !== req.params.workspaceId);
    await user.save();
    
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update user settings
exports.updateUserSettings = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    user.settings = req.body.settingsId;
    await user.save();
    
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get user settings
exports.getUserSettings = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('settings');
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (!user.settings) return res.status(404).json({ message: 'User settings not found' });
    
    res.json(user.settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};