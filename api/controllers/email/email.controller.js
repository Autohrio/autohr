const { Email, EmailSMTPConfig, EmailTemplates, Workspace } = require('../../models/models');
const nodemailer = require('nodemailer');

// Create a new email configuration
exports.createEmailConfig = async (req, res) => {
  try {
    const { workspaceId, smtp_config, templates } = req.body;

    // Create SMTP config
    const smtpConfig = new EmailSMTPConfig(smtp_config);
    await smtpConfig.save();

    // Create email templates
    const emailTemplates = new EmailTemplates(templates);
    await emailTemplates.save();

    // Create email configuration
    const email = new Email({
      smtp_config: smtpConfig._id,
      templates: emailTemplates._id
    });
    await email.save();

    // Add email config to workspace if workspaceId is provided
    if (workspaceId) {
      const workspace = await Workspace.findById(workspaceId);
      if (workspace) {
        workspace.emails.push(email._id);
        await workspace.save();
      }
    }

    res.status(201).json(email);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all email configurations
exports.getAllEmailConfigs = async (req, res) => {
  try {
    const emails = await Email.find().populate('smtp_config templates');
    res.json(emails);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single email configuration by ID (Approved)
// @params: workspaceId
exports.getEmailConfigByWorkspaceId = async (req, res) => {
  try {
    const email = await Email.findOne({ workspace: req.params.workspaceId })
    if (!email) return res.status(404).json({ message: 'Email configuration not found' });
    res.json(email);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update an email configuration
exports.updateEmailConfig = async (req, res) => {
  try {
    const { smtp_config, templates } = req.body;
    const email = await Email.findById(req.params.id);
    if (!email) return res.status(404).json({ message: 'Email configuration not found' });

    if (smtp_config) {
      await EmailSMTPConfig.findByIdAndUpdate(email.smtp_config, smtp_config);
    }
    if (templates) {
      await EmailTemplates.findByIdAndUpdate(email.templates, templates);
    }

    const updatedEmail = await Email.findById(req.params.id).populate('smtp_config templates');
    res.json(updatedEmail);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateEmailConfiguration = async (req, res) => {
  try {
    const { workspaceId } = req.params; // This is the workspaceId
    const updates = req.body;

    const emailConfig = await Email.findOne({ workspace: workspaceId });
    
    if (!emailConfig) {
      return res.status(404).json({ message: 'Email configuration not found' });
    }

    // Update SMTP config
    if (updates.smtp_config) {
      Object.assign(emailConfig.smtp_config, updates.smtp_config);
    }

    // Update templates
    if (updates.templates) {
      Object.assign(emailConfig.templates, updates.templates);
    }

    await emailConfig.save();

    res.status(200).json(emailConfig);
  } catch (error) {
    console.error('Error in updateEmailConfiguration:', error);
    res.status(400).json({ message: 'Error updating email configuration', error: error.message });
  }
};


exports.patchEmailConfiguration = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const updates = req.body;

    const emailConfig = await Email.findOne({ workspace: workspaceId });
    if (!emailConfig) {
      return res.status(404).json({ message: 'Email configuration not found' });
    }

    // Update SMTP config
    if (updates.smtp_config) {
      // Use spread operator for a cleaner update
      emailConfig.smtp_config = { ...emailConfig.smtp_config, ...updates.smtp_config };
    }

    // Update templates
    if (updates.templates) {
      // Use spread operator for a cleaner update
      emailConfig.templates = { ...emailConfig.templates, ...updates.templates };
    }

    // Validate the updated document before saving
    const validationError = emailConfig.validateSync();
    if (validationError) {
      return res.status(400).json({ message: 'Validation error', error: validationError.message });
    }

    const updatedConfig = await emailConfig.save();
    res.status(200).json(updatedConfig);
  } catch (error) {
    console.error('Error in updateEmailConfiguration:', error);
    res.status(500).json({ message: 'Error updating email configuration', error: error.message });
  }
};

// Delete an email configuration
exports.deleteEmailConfig = async (req, res) => {
  try {
    const email = await Email.findById(req.params.id);
    if (!email) return res.status(404).json({ message: 'Email configuration not found' });

    await EmailSMTPConfig.findByIdAndDelete(email.smtp_config);
    await EmailTemplates.findByIdAndDelete(email.templates);
    await Email.findByIdAndDelete(req.params.id);

    // Remove email config from all workspaces that reference it
    await Workspace.updateMany(
      { emails: email._id },
      { $pull: { emails: email._id } }
    );

    res.json({ message: 'Email configuration deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get email configurations by workspace
exports.getEmailConfigsByWorkspace = async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.workspaceId).populate({
      path: 'emails',
      populate: { path: 'smtp_config templates' }
    });
    if (!workspace) return res.status(404).json({ message: 'Workspace not found' });
    res.json(workspace.emails);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Send a test email
exports.sendTestEmail = async (req, res) => {
  try {
    // TODO add Development Mode, where it will send to Mailhog configuration
    const { emailId, to, subject, body } = req.body;
    const email = await Email.findById(emailId).populate('smtp_config');
    if (!email) return res.status(404).json({ message: 'Email configuration not found' });

    const transporter = nodemailer.createTransport({
      host: email.smtp_config.host,
      port: email.smtp_config.port,
      auth: {
        user: email.smtp_config.username,
        pass: email.smtp_config.password
      }
    });

    const info = await transporter.sendMail({
      from: email.smtp_config.fromEmail,
      to,
      subject,
      text: body
    });

    res.json({ message: 'Test email sent successfully', messageId: info.messageId });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update email templates
exports.updateEmailTemplates = async (req, res) => {
  try {
    const { emailId, templates } = req.body;
    const email = await Email.findById(emailId);
    if (!email) return res.status(404).json({ message: 'Email configuration not found' });

    await EmailTemplates.findByIdAndUpdate(email.templates, templates);
    const updatedEmail = await Email.findById(emailId).populate('smtp_config templates');
    res.json(updatedEmail);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get email templates
exports.getEmailTemplates = async (req, res) => {
  try {
    const email = await Email.findById(req.params.emailId).populate('templates');
    if (!email) return res.status(404).json({ message: 'Email configuration not found' });
    res.json(email.templates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
