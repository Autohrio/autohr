const { CompanyFeedback, TeamMember, Workspace } = require('../../models/models');

// Create new company feedback
exports.createCompanyFeedback = async (req, res) => {
  try {
    const { workspaceId, from_employee, feedback } = req.body;
    const companyFeedback = new CompanyFeedback({
      from_employee,
      feedback,
      created_at: new Date()
    });
    await companyFeedback.save();

    // Add feedback to workspace
    if (workspaceId) {
      const workspace = await Workspace.findById(workspaceId);
      if (workspace) {
        workspace.companyFeedbacks.push(companyFeedback._id);
        await workspace.save();
      } else {
        return res.status(404).json({ message: 'Workspace not found' });
      }
    }

    res.status(201).json(companyFeedback);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all company feedback
exports.getAllCompanyFeedback = async (req, res) => {
  try {
    const companyFeedbacks = await CompanyFeedback.find()
      .populate('from_employee', 'name email');
    res.json(companyFeedbacks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get company feedback by ID
exports.getCompanyFeedbackById = async (req, res) => {
  try {
    const companyFeedback = await CompanyFeedback.findById(req.params.id)
      .populate('from_employee', 'name email');
    if (!companyFeedback) return res.status(404).json({ message: 'Company feedback not found' });
    res.json(companyFeedback);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update company feedback
exports.updateCompanyFeedback = async (req, res) => {
  try {
    const { feedback } = req.body;
    const companyFeedback = await CompanyFeedback.findByIdAndUpdate(
      req.params.id,
      { feedback },
      { new: true, runValidators: true }
    ).populate('from_employee', 'name email');
    if (!companyFeedback) return res.status(404).json({ message: 'Company feedback not found' });
    res.json(companyFeedback);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete company feedback
exports.deleteCompanyFeedback = async (req, res) => {
  try {
    const companyFeedback = await CompanyFeedback.findByIdAndDelete(req.params.id);
    if (!companyFeedback) return res.status(404).json({ message: 'Company feedback not found' });

    // Remove feedback from workspace
    await Workspace.updateMany(
      { companyFeedbacks: companyFeedback._id },
      { $pull: { companyFeedbacks: companyFeedback._id } }
    );

    res.json({ message: 'Company feedback deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get company feedback by workspace
exports.getCompanyFeedbackByWorkspace = async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.workspaceId).populate({
      path: 'companyFeedbacks',
      populate: { path: 'from_employee', select: 'name email' }
    });
    if (!workspace) return res.status(404).json({ message: 'Workspace not found' });
    res.json(workspace.companyFeedbacks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get company feedback given by an employee
exports.getCompanyFeedbackByEmployee = async (req, res) => {
  try {
    const companyFeedbacks = await CompanyFeedback.find({ from_employee: req.params.employeeId })
      .populate('from_employee', 'name email');
    res.json(companyFeedbacks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get company feedback summary
exports.getCompanyFeedbackSummary = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const workspace = await Workspace.findById(workspaceId).populate('companyFeedbacks');
    if (!workspace) return res.status(404).json({ message: 'Workspace not found' });

    const companyFeedbacks = workspace.companyFeedbacks;

    const summary = {
      totalFeedbacks: companyFeedbacks.length,
      averageSentiment: calculateAverageSentiment(companyFeedbacks),
      topPositiveThemes: getTopThemes(companyFeedbacks, 'positive'),
      topNegativeThemes: getTopThemes(companyFeedbacks, 'negative'),
      recentTrends: getRecentTrends(companyFeedbacks)
    };

    res.json(summary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Helper functions for company feedback summary
function calculateAverageSentiment(feedbacks) {
  // Implement your logic to calculate average sentiment
  // This is a placeholder implementation
  return feedbacks.reduce((sum, feedback) => sum + (feedback.sentiment || 0), 0) / feedbacks.length;
}

function getTopThemes(feedbacks, type) {
  // Implement your logic to extract top themes
  // This is a placeholder implementation
  return type === 'positive' 
    ? ['Company Culture', 'Work-Life Balance', 'Career Growth']
    : ['Communication', 'Process Improvement', 'Resource Allocation'];
}

function getRecentTrends(feedbacks) {
  // Implement your logic to identify recent trends
  // This is a placeholder implementation
  return [
    { theme: 'Remote Work', sentiment: 'Positive', frequency: 'Increasing' },
    { theme: 'Team Collaboration', sentiment: 'Mixed', frequency: 'Stable' }
  ];
}

// Get anonymized company feedback
exports.getAnonymizedCompanyFeedback = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const workspace = await Workspace.findById(workspaceId).populate('companyFeedbacks');
    if (!workspace) return res.status(404).json({ message: 'Workspace not found' });

    const anonymizedFeedbacks = workspace.companyFeedbacks.map(feedback => ({
      id: feedback._id,
      feedback: feedback.feedback,
      created_at: feedback.created_at
    }));

    res.json(anonymizedFeedbacks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};