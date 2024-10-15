const { EmployeeFeedback, TeamMember, Workspace } = require('../../models/models');

// Create new employee feedback
exports.createEmployeeFeedback = async (req, res) => {
  try {
    const { workspaceId, from_employee, to_employee, feedback } = req.body;
    const employeeFeedback = new EmployeeFeedback({
      from_employee,
      to_employee,
      feedback,
      created_at: new Date()
    });
    await employeeFeedback.save();

    // Add feedback to workspace
    if (workspaceId) {
      const workspace = await Workspace.findById(workspaceId);
      if (workspace) {
        workspace.employeeFeedbacks.push(employeeFeedback._id);
        await workspace.save();
      } else {
        return res.status(404).json({ message: 'Workspace not found' });
      }
    }

    res.status(201).json(employeeFeedback);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all employee feedback
exports.getAllEmployeeFeedback = async (req, res) => {
  try {
    const employeeFeedbacks = await EmployeeFeedback.find()
      .populate('from_employee', 'name email')
      .populate('to_employee', 'name email');
    res.json(employeeFeedbacks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get employee feedback by ID
exports.getEmployeeFeedbackById = async (req, res) => {
  try {
    const employeeFeedback = await EmployeeFeedback.findById(req.params.id)
      .populate('from_employee', 'name email')
      .populate('to_employee', 'name email');
    if (!employeeFeedback) return res.status(404).json({ message: 'Employee feedback not found' });
    res.json(employeeFeedback);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update employee feedback
exports.updateEmployeeFeedback = async (req, res) => {
  try {
    const { feedback } = req.body;
    const employeeFeedback = await EmployeeFeedback.findByIdAndUpdate(
      req.params.id,
      { feedback },
      { new: true, runValidators: true }
    ).populate('from_employee', 'name email')
     .populate('to_employee', 'name email');
    if (!employeeFeedback) return res.status(404).json({ message: 'Employee feedback not found' });
    res.json(employeeFeedback);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete employee feedback
exports.deleteEmployeeFeedback = async (req, res) => {
  try {
    const employeeFeedback = await EmployeeFeedback.findByIdAndDelete(req.params.id);
    if (!employeeFeedback) return res.status(404).json({ message: 'Employee feedback not found' });

    // Remove feedback from workspace
    await Workspace.updateMany(
      { employeeFeedbacks: employeeFeedback._id },
      { $pull: { employeeFeedbacks: employeeFeedback._id } }
    );

    res.json({ message: 'Employee feedback deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get employee feedback by workspace
exports.getEmployeeFeedbackByWorkspace = async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.workspaceId).populate({
      path: 'employeeFeedbacks',
      populate: [
        { path: 'from_employee', select: 'name email' },
        { path: 'to_employee', select: 'name email' }
      ]
    });
    if (!workspace) return res.status(404).json({ message: 'Workspace not found' });
    res.json(workspace.employeeFeedbacks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get feedback received by an employee
exports.getFeedbackReceivedByEmployee = async (req, res) => {
  try {
    const employeeFeedbacks = await EmployeeFeedback.find({ to_employee: req.params.employeeId })
      .populate('from_employee', 'name email')
      .populate('to_employee', 'name email');
    res.json(employeeFeedbacks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get feedback given by an employee
exports.getFeedbackGivenByEmployee = async (req, res) => {
  try {
    const employeeFeedbacks = await EmployeeFeedback.find({ from_employee: req.params.employeeId })
      .populate('from_employee', 'name email')
      .populate('to_employee', 'name email');
    res.json(employeeFeedbacks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get feedback summary for an employee
exports.getEmployeeFeedbackSummary = async (req, res) => {
  try {
    const employeeId = req.params.employeeId;
    const feedbackReceived = await EmployeeFeedback.find({ to_employee: employeeId });
    const feedbackGiven = await EmployeeFeedback.find({ from_employee: employeeId });

    const summary = {
      totalFeedbackReceived: feedbackReceived.length,
      totalFeedbackGiven: feedbackGiven.length,
      averageRating: calculateAverageRating(feedbackReceived),
      topStrengths: getTopStrengths(feedbackReceived),
      areasForImprovement: getAreasForImprovement(feedbackReceived)
    };

    res.json(summary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Helper functions for feedback summary
function calculateAverageRating(feedbacks) {
  // Implement your logic to calculate average rating
  // This is a placeholder implementation
  return feedbacks.reduce((sum, feedback) => sum + (feedback.rating || 0), 0) / feedbacks.length;
}

function getTopStrengths(feedbacks) {
  // Implement your logic to extract top strengths
  // This is a placeholder implementation
  return ['Communication', 'Teamwork', 'Problem Solving'];
}

function getAreasForImprovement(feedbacks) {
  // Implement your logic to extract areas for improvement
  // This is a placeholder implementation
  return ['Time Management', 'Technical Skills'];
}