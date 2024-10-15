module.exports = {
  userController: require('./user/user.controller'),
  workspaceController: require('./workspace/workspace.controller'),
  teamController: require('./team/team.controller'),
  onboardingController: require('./onboarding/onboarding.controller'),
  policyController: require('./policies/policies.controller'),
  complianceController: require('./compliance/compliance.controller'),
  emailController: require('./email/email.controller'),
  apiKeyController: require('./apiKey/apiKey.controller'),
  billingController: require('./billing/billing.controller'),
  settingsController: require('./settings/settings.controller'),
  employeeFeedbackController: require('./feedback/feedback.controller'),
  companyFeedbackController: require('./feedback/companyFeedback.controller'),
}