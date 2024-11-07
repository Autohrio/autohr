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
  // Basic Information
  user: { 
    type: Schema.Types.ObjectId, 
    ref: 'User',
    // Not required initially as it might be added before user creation
  },
  name: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true 
  },
  employee_id: {
    type: String
  },
  
  // Position and Organization
  position: {
    type: String
  },
  organizational_unit: {
    type: String
  },
  rank: {
    type: String,
    enum: ['Manager', 'Supervisor', 'Rank and File'],
  },
  role: { 
    type: String, 
    enum: ['owner', 'member', 'guest', 'manager', 'supervisor'], 
  },

  // Dates
  hire_date: {
    type: Date,
  },
  regularization_date: {
    type: Date
  },

  // Leave Information
  leave_balance: {
    vacation_leave: {
      type: Number,
      default: 0
    },
    sick_leave: {
      type: Number,
      default: 0
    }
  },

  // Compensation
  compensation: {
    basic_pay: {
      amount: {
        type: Number,
        default: 0
      },
      currency: {
        type: String,
        default: 'PHP'
      }
    }
  },

  // Status and Relationships
  employment_status: {
    type: String,
    enum: ['Permanent', 'Probation', 'Contract', 'Resigned', 'Terminated']
  },
  supervisor: {
    type: Schema.Types.ObjectId,
    ref: 'TeamMember'
  },
  reporting_line: [{
    type: Schema.Types.ObjectId,
    ref: 'TeamMember'
  }],
  
  // Workspace and Team Relationships
  workspace: { 
    type: Schema.Types.ObjectId, 
    ref: 'Workspace', 
    required: true 
  },
  teams: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'Team' 
  }]
}, {
  timestamps: true
});

// Indexes
teamMemberSchema.index({ workspace: 1, employee_id: 1 });
teamMemberSchema.index({ workspace: 1, email: 1 }, { unique: true });
teamMemberSchema.index({ user: 1, workspace: 1 });
teamMemberSchema.index({ workspace: 1, organizational_unit: 1 });
teamMemberSchema.index({ workspace: 1, employment_status: 1 });
// Methods
teamMemberSchema.methods = {
  // Get leave balance
  getLeaveBalance() {
    return this.leave_balance;
  },
  async linkUser (userId) {
    this.user = userId;
    await this.save();
    return this;
  },
  // Update leave balance
  async updateLeaveBalance(leaveType, amount) {
    if (leaveType === 'vacation') {
      this.leave_balance.vacation_leave += amount;
    } else if (leaveType === 'sick') {
      this.leave_balance.sick_leave += amount;
    }
    await this.save();
  },

  // Get reporting line
  async getReportingLine() {
    return await this.populate('reporting_line').execPopulate();
  }
};

// Statics
teamMemberSchema.statics = {
  // Find members by workspace
  findByWorkspace(workspaceId) {
    return this.find({ workspace: workspaceId })
      .populate('supervisor')
      .populate('teams');
  },

  async findOrLinkByEmail(workspaceId, email, userId) {
    const teamMember = await this.findOne({
      workspace: workspaceId,
      email: email
    });
  
    if (teamMember && !teamMember.user && userId) {
      teamMember.user = userId;
      await teamMember.save();
    }
  
    return teamMember;
  },
  async findByUserAndWorkspace(userId, workspaceId) {
    return this.findOne({
      user: userId,
      workspace: workspaceId
    }).populate('supervisor');
  },

  // Get reporting structure
  async getReportingStructure(workspaceId) {
    return this.find({ workspace: workspaceId })
      .populate({
        path: 'supervisor',
        select: 'name position'
      })
      .select('name position supervisor organizational_unit');
  },

  // Find by employee ID
  async findByEmployeeId(employeeId, workspaceId) {
    return this.findOne({
      employee_id: employeeId,
      workspace: workspaceId
    }).populate('supervisor');
  }
};

// Virtuals
teamMemberSchema.virtual('fullName').get(function() {
  return this.name;
});

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