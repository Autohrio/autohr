const { Settings, User } = require('../../models/models');

// Create new settings for a user
exports.createSettings = async (req, res) => {
  try {
    const { userId, ...settingsData } = req.body;
    const settings = new Settings(settingsData);
    await settings.save();

    // Add settings to user
    if (userId) {
      const user = await User.findById(userId);
      if (user) {
        user.settings = settings._id;
        await user.save();
      } else {
        return res.status(404).json({ message: 'User not found' });
      }
    }

    res.status(201).json(settings);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get settings by ID
exports.getSettingsById = async (req, res) => {
  try {
    const settings = await Settings.findById(req.params.id);
    if (!settings) return res.status(404).json({ message: 'Settings not found' });
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update settings
exports.updateSettings = async (req, res) => {
  try {
    const settings = await Settings.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!settings) return res.status(404).json({ message: 'Settings not found' });
    res.json(settings);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete settings
exports.deleteSettings = async (req, res) => {
  try {
    const settings = await Settings.findByIdAndDelete(req.params.id);
    if (!settings) return res.status(404).json({ message: 'Settings not found' });

    // Remove settings reference from user
    await User.updateOne(
      { settings: settings._id },
      { $unset: { settings: 1 } }
    );

    res.json({ message: 'Settings deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get settings by user
exports.getSettingsByUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate('settings');
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (!user.settings) return res.status(404).json({ message: 'Settings not found for this user' });
    res.json(user.settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update preferred language
exports.updatePreferredLanguage = async (req, res) => {
  try {
    const { userId, preferred_language } = req.body;
    const user = await User.findById(userId).populate('settings');
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (!user.settings) return res.status(404).json({ message: 'Settings not found for this user' });

    user.settings.preferred_language = preferred_language;
    await user.settings.save();

    res.json(user.settings);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Toggle notifications
exports.toggleNotifications = async (req, res) => {
  try {
    const { userId, notifications_enabled } = req.body;
    const user = await User.findById(userId).populate('settings');
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (!user.settings) return res.status(404).json({ message: 'Settings not found for this user' });

    user.settings.notifications_enabled = notifications_enabled;
    await user.settings.save();

    res.json(user.settings);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get notification preferences
exports.getNotificationPreferences = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate('settings');
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (!user.settings) return res.status(404).json({ message: 'Settings not found for this user' });

    res.json({
      notifications_enabled: user.settings.notifications_enabled,
      // Add other notification preferences here as needed
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update theme preference
exports.updateThemePreference = async (req, res) => {
  try {
    const { userId, theme } = req.body;
    const user = await User.findById(userId).populate('settings');
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (!user.settings) return res.status(404).json({ message: 'Settings not found for this user' });

    user.settings.theme = theme;
    await user.settings.save();

    res.json(user.settings);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all user preferences
exports.getAllUserPreferences = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate('settings');
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (!user.settings) return res.status(404).json({ message: 'Settings not found for this user' });

    res.json({
      preferred_language: user.settings.preferred_language,
      notifications_enabled: user.settings.notifications_enabled,
      theme: user.settings.theme,
      // Add other preferences here as needed
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};