const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// User Schema
const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  username: { type: String, unique: true },
  bio: String,
  urls: [String],
  birth_date: Date,
  language: String,
  settings: { type: Schema.Types.ObjectId, ref: 'Settings' },
  workspaces: [{ type: Schema.Types.ObjectId, ref: 'Workspace' }]
});

// Workspace Schema
const workspaceSchema = new Schema({
  name: { type: String, required: true },
  owner_email: { type: String, required: true },
  teams: [{ type: Schema.Types.ObjectId, ref: 'Team' }],
  onboardings: [{ type: Schema.Types.ObjectId, ref: 'Onboarding' }],
  policies: [{ type: Schema.Types.ObjectId, ref: 'Policy' }],
  compliances: [{ type: Schema.Types.ObjectId, ref: 'Compliance' }],
  meetings: [{ type: Schema.Types.ObjectId, ref: 'Meeting' }],
  emails: [{ type: Schema.Types.ObjectId, ref: 'Email' }],
  apiKeys: [{ type: Schema.Types.ObjectId, ref: 'APIKey' }],
  billing: { type: Schema.Types.ObjectId, ref: 'Billing' },
  employeeFeedbacks: [{ type: Schema.Types.ObjectId, ref: 'EmployeeFeedback' }],
  companyFeedbacks: [{ type: Schema.Types.ObjectId, ref: 'CompanyFeedback' }]
});

// Team Schema
const teamSchema = new Schema({
  name: { type: String, required: true },
  workspace: { type: Schema.Types.ObjectId, ref: 'Workspace', required: true },
  members: [{ type: Schema.Types.ObjectId, ref: 'TeamMember' }]
});

// Team Member Schema
const teamMemberSchema = new Schema({
  name: { type: String, required: true },
  role: { type: String, enum: ['owner', 'member', 'guest'], required: true },
  occupation: String,
  email: { type: String, required: true },
  workspace: { type: Schema.Types.ObjectId, ref: 'Workspace', required: true },
  teams: [{ type: Schema.Types.ObjectId, ref: 'Team' }]
});

teamMemberSchema.index({ email: 1, workspace: 1 }, { unique: true });

// Onboarding Schema
const onboardingSchema = new Schema({
  workspace: { type: Schema.Types.ObjectId, ref: 'Workspace', required: true },
  candidates: [{ type: Schema.Types.ObjectId, ref: 'Candidate' }]
});

const candidateSchema = new Schema({
  name: { type: String, required: true },
  occupation: String,
  email: { type: String, required: true, unique: true },
  interview_status: String,
  workspace: { type: Schema.Types.ObjectId, ref: 'Workspace', required: true }
});

// Policy Schema
const policySchema = new Schema({
  content: { type: String, required: true }
});

// Compliance Schema
const complianceSchema = new Schema({
  content: { type: String, required: true }
});

// Meeting Schema
const meetingSchema = new Schema({
  sync_source: String
});

// Email Schema
const emailSchema = new Schema({
  workspace: { type: Schema.Types.ObjectId, ref: 'Workspace', required: true },
  smtp_config: {
    host: { type: String, required: true },
    port: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    fromEmail: { type: String, required: true }
  },
  templates: {
    offer_template: { type: String, default: '' },
    rejection_template: { type: String, default: '' }
  }
});

// Email SMTP Config Schema
const emailSMTPConfigSchema = new Schema({
  host: { type: String, required: true },
  port: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  fromEmail: { type: String, required: true }
});

// Email Templates Schema
const emailTemplatesSchema = new Schema({
  offer_template: String,
  rejection_template: String
});

// API Key Schema
const apiKeySchema = new Schema({
  created_at: { type: Date, default: Date.now },
  api_key: { type: String, required: true, unique: true },
  name: { type: String, required: true }
});

// Billing Schema
const billingSchema = new Schema({
  plan: { type: String, required: true }
});

// Settings Schema
const settingsSchema = new Schema({
  preferred_language: String,
  notifications_enabled: Boolean
});

// Employee Feedback Schema
const employeeFeedbackSchema = new Schema({
  from_employee: { type: Schema.Types.ObjectId, ref: 'TeamMember', required: true },
  to_employee: { type: Schema.Types.ObjectId, ref: 'TeamMember', required: true },
  feedback: { type: String, required: true },
  created_at: { type: Date, default: Date.now }
});

// Company Feedback Schema
const companyFeedbackSchema = new Schema({
  from_employee: { type: Schema.Types.ObjectId, ref: 'TeamMember', required: true },
  feedback: { type: String, required: true },
  created_at: { type: Date, default: Date.now }
});

module.exports = {
  User: mongoose.model('User', userSchema),
  Workspace: mongoose.model('Workspace', workspaceSchema),
  Team: mongoose.model('Team', teamSchema),
  TeamMember: mongoose.model('TeamMember', teamMemberSchema),
  Onboarding: mongoose.model('Onboarding', onboardingSchema),
  Candidate: mongoose.model('Candidate', candidateSchema),
  Policy: mongoose.model('Policy', policySchema),
  Compliance: mongoose.model('Compliance', complianceSchema),
  Meeting: mongoose.model('Meeting', meetingSchema),
  Email: mongoose.model('Email', emailSchema),
  EmailSMTPConfig: mongoose.model('EmailSMTPConfig', emailSMTPConfigSchema),
  EmailTemplates: mongoose.model('EmailTemplates', emailTemplatesSchema),
  APIKey: mongoose.model('APIKey', apiKeySchema),
  Billing: mongoose.model('Billing', billingSchema),
  Settings: mongoose.model('Settings', settingsSchema),
  EmployeeFeedback: mongoose.model('EmployeeFeedback', employeeFeedbackSchema),
  CompanyFeedback: mongoose.model('CompanyFeedback', companyFeedbackSchema)
};