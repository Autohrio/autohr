const express = require('express')

const router = express.Router()
const { 
  userController,
  workspaceController,
  teamController,
  onboardingController,
  policyController,
  complianceController,
  emailController,
  apiKeyController,
  billingController,
  settingsController,
  employeeFeedbackController,
  companyFeedbackController,
 } = require('../controllers')

router.post('/users', userController.createUser);
router.get('/users', userController.getUsers);
router.get('/users/:id', userController.getUserById);
router.post('/users/email', userController.getUserByEmail);
router.put('/users/:id', userController.updateUser);
router.delete('/users/:id', userController.deleteUser);
router.get('/users/:id/workspaces', userController.getUserWorkspaces);
router.post('/users/:id/workspaces', userController.addWorkspaceToUser);
router.delete('/users/:id/workspaces/:workspaceId', userController.removeWorkspaceFromUser);
router.put('/users/:id/settings', userController.updateUserSettings);
router.get('/users/:id/settings', userController.getUserSettings);

router.post('/workspaces', workspaceController.createWorkspace);
router.post('/workspaces/owner', workspaceController.getWorkspaces);
router.get('/workspaces/:id', workspaceController.getWorkspaceById);
router.put('/workspaces/:id', workspaceController.updateWorkspace);
router.delete('/workspaces/:id', workspaceController.deleteWorkspace);
router.get('/workspaces/:id/teams', workspaceController.getWorkspaceTeams);
router.post('/workspaces/:id/teams', workspaceController.addTeamToWorkspace);
router.delete('/workspaces/:id/teams/:teamId', workspaceController.removeTeamFromWorkspace);
router.get('/workspaces/:id/policies', workspaceController.getWorkspacePolicies);
router.post('/workspaces/:id/policies', workspaceController.addPolicyToWorkspace);
router.get('/workspaces/:id/billing', workspaceController.getWorkspaceBilling);
router.put('/workspaces/:id/billing', workspaceController.updateWorkspaceBilling);

router.post('/teams', teamController.createTeam);
router.get('/teams', teamController.getTeams);
router.get('/teams/:id', teamController.getTeamById);
router.put('/teams/:id', teamController.updateTeam);
router.delete('/teams/:id', teamController.deleteTeam);
router.get('/teams/:id/members', teamController.getTeamMembers);
router.post('/teams/:teamId/members', teamController.addMemberToTeam);
router.delete('/teams/:teamId/members/:memberId', teamController.removeMemberFromTeam);
router.put('/teams/:id/members/:memberId/role', teamController.updateTeamMemberRole);
router.get('/workspaces/:workspaceId/teams', teamController.getTeamsByWorkspace);
router.get('/workspace/:workspaceId/members', teamController.getTeamMembersByWorkspace);


// Onboarding routes
// router.post('/onboardings', onboardingController.createOnboarding);
// router.get('/onboardings', onboardingController.getAllOnboardings);
// router.get('/onboardings/:id', onboardingController.getOnboardingById);
// router.put('/onboardings/:id', onboardingController.updateOnboarding);
// router.delete('/onboardings/:id', onboardingController.deleteOnboarding);

// Candidate routes
// router.post('/candidates', onboardingController.createCandidate);
// router.get('/candidates', onboardingController.getAllCandidates);
// router.get('/candidates/:id', onboardingController.getCandidateById);
// router.put('/candidates/:id', onboardingController.updateCandidate);
// router.delete('/candidates/:id', onboardingController.deleteCandidate);
// router.put('/candidates/:id/interview-status', onboardingController.updateCandidateInterviewStatus);
// router.get('/onboardings/:onboardingId/candidates', onboardingController.getCandidatesByOnboarding);

// policies routes
router.post('/policies', policyController.createPolicy);
router.get('/policies', policyController.getAllPolicies);
router.get('/policies/:id', policyController.getPolicyById);
router.put('/policies/:id', policyController.updatePolicy);
router.delete('/policies/:id', policyController.deletePolicy);
router.get('/workspaces/:workspaceId/policies', policyController.getPoliciesByWorkspace);
router.post('/workspaces/:workspaceId/policies/:policyId', policyController.addPolicyToWorkspace);
router.delete('/workspaces/:workspaceId/policies/:policyId', policyController.removePolicyFromWorkspace);
router.get('/policies/search', policyController.searchPolicies);
 

// compliance routes
router.post('/compliances', complianceController.createCompliance);
router.get('/compliances', complianceController.getAllCompliances);
router.get('/compliances/:id', complianceController.getComplianceById);
router.put('/compliances/:id', complianceController.updateCompliance);
router.delete('/compliances/:id', complianceController.deleteCompliance);
router.get('/workspaces/:workspaceId/compliances', complianceController.getCompliancesByWorkspace);
router.post('/workspaces/:workspaceId/compliances/:complianceId', complianceController.addComplianceToWorkspace);
router.delete('/workspaces/:workspaceId/compliances/:complianceId', complianceController.removeComplianceFromWorkspace);
router.get('/compliances/search', complianceController.searchCompliances);
router.get('/workspaces/:workspaceId/compliance-status', complianceController.getComplianceStatus);

// email routes
router.post('/emails', emailController.createEmailConfig);
router.get('/emails', emailController.getAllEmailConfigs);
router.get('/emails/:id', emailController.getEmailConfigById);
router.put('/emails/:id', emailController.updateEmailConfig);
router.delete('/emails/:id', emailController.deleteEmailConfig);
router.get('/workspaces/:workspaceId/emails', emailController.getEmailConfigsByWorkspace);
router.post('/emails/test', emailController.sendTestEmail);
router.put('/emails/:emailId/templates', emailController.updateEmailTemplates);
router.get('/emails/:emailId/templates', emailController.getEmailTemplates);

// apikeys routes
router.post('/api-keys', apiKeyController.createApiKey);
router.get('/api-keys', apiKeyController.getAllApiKeys);
router.get('/api-keys/:id', apiKeyController.getApiKeyById);
router.put('/api-keys/:id', apiKeyController.updateApiKey);
router.delete('/api-keys/:id', apiKeyController.deleteApiKey);
router.get('/workspaces/:workspaceId/api-keys', apiKeyController.getApiKeysByWorkspace);
router.post('/api-keys/:id/regenerate', apiKeyController.regenerateApiKey);
router.post('/api-keys/validate', apiKeyController.validateApiKey);
router.get('/api-keys/:id/usage', apiKeyController.getApiKeyUsageStats);


// billing routes
router.post('/billing', billingController.createBillingPlan);
router.get('/billing', billingController.getAllBillingPlans);
router.get('/billing/:id', billingController.getBillingPlanById);
router.put('/billing/:id', billingController.updateBillingPlan);
router.delete('/billing/:id', billingController.deleteBillingPlan);
router.get('/workspaces/:workspaceId/billing', billingController.getBillingPlanByWorkspace);
router.post('/billing/change-plan', billingController.changeBillingPlan);
router.get('/workspaces/:workspaceId/billing/invoice', billingController.getBillingInvoice);
router.post('/billing/update-payment', billingController.updatePaymentMethod);
router.get('/workspaces/:workspaceId/billing/usage', billingController.getBillingUsage);


// settings routes
router.post('/settings', settingsController.createSettings);
router.get('/settings/:id', settingsController.getSettingsById);
router.put('/settings/:id', settingsController.updateSettings);
router.delete('/settings/:id', settingsController.deleteSettings);
router.get('/users/:userId/settings', settingsController.getSettingsByUser);
router.put('/users/language', settingsController.updatePreferredLanguage);
router.put('/users/notifications', settingsController.toggleNotifications);
router.get('/users/:userId/notifications', settingsController.getNotificationPreferences);
router.put('/users/theme', settingsController.updateThemePreference);
router.get('/users/:userId/preferences', settingsController.getAllUserPreferences);


// employee feedback routes
router.post('/employee-feedback', employeeFeedbackController.createEmployeeFeedback);
router.get('/employee-feedback', employeeFeedbackController.getAllEmployeeFeedback);
router.get('/employee-feedback/:id', employeeFeedbackController.getEmployeeFeedbackById);
router.put('/employee-feedback/:id', employeeFeedbackController.updateEmployeeFeedback);
router.delete('/employee-feedback/:id', employeeFeedbackController.deleteEmployeeFeedback);
router.get('/workspaces/:workspaceId/employee-feedback', employeeFeedbackController.getEmployeeFeedbackByWorkspace);
router.get('/employees/:employeeId/feedback-received', employeeFeedbackController.getFeedbackReceivedByEmployee);
router.get('/employees/:employeeId/feedback-given', employeeFeedbackController.getFeedbackGivenByEmployee);
router.get('/employees/:employeeId/feedback-summary', employeeFeedbackController.getEmployeeFeedbackSummary);


// company feedback routes
router.post('/company-feedback', companyFeedbackController.createCompanyFeedback);
router.get('/company-feedback', companyFeedbackController.getAllCompanyFeedback);
router.get('/company-feedback/:id', companyFeedbackController.getCompanyFeedbackById);
router.put('/company-feedback/:id', companyFeedbackController.updateCompanyFeedback);
router.delete('/company-feedback/:id', companyFeedbackController.deleteCompanyFeedback);
router.get('/workspaces/:workspaceId/company-feedback', companyFeedbackController.getCompanyFeedbackByWorkspace);
router.get('/employees/:employeeId/company-feedback', companyFeedbackController.getCompanyFeedbackByEmployee);
router.get('/workspaces/:workspaceId/company-feedback-summary', companyFeedbackController.getCompanyFeedbackSummary);
router.get('/workspaces/:workspaceId/anonymized-company-feedback', companyFeedbackController.getAnonymizedCompanyFeedback);


module.exports = router;