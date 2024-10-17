const { Onboarding, Candidate, Workspace } = require('../../models/models');

// exports.createOnboarding = async (req, res) => {
//   try {
//     const { workspaceId } = req.body;
    
//     // Check if workspace exists
//     const workspace = await Workspace.findById(workspaceId);
//     if (!workspace) {
//       return res.status(404).json({ message: 'Workspace not found' });
//     }

//     // Check if workspace already has an onboarding
//     if (workspace.onboardings) {
//       return res.status(400).json({ message: 'Workspace already has an onboarding process' });
//     }

//     const onboarding = new Onboarding({ workspace: workspaceId });
//     await onboarding.save();

//     // Add onboarding to workspace
//     workspace.onboardings = onboarding._id;
//     await workspace.save();

//     res.status(201).json(onboarding);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// // Get onboarding process by workspace ID
// exports.getOnboardingByWorkspace = async (req, res) => {
//   try {
//     const { workspaceId } = req.params;
//     const onboarding = await Onboarding.findOne({ workspace: workspaceId }).populate('candidates');
//     if (!onboarding) return res.status(404).json({ message: 'Onboarding process not found' });
//     res.json(onboarding);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Update an onboarding process
// exports.updateOnboarding = async (req, res) => {
//   try {
//     const onboarding = await Onboarding.findOneAndUpdate(
//       { workspace: req.params.workspaceId },
//       req.body,
//       { new: true, runValidators: true }
//     );
//     if (!onboarding) return res.status(404).json({ message: 'Onboarding process not found' });
//     res.json(onboarding);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// // Delete an onboarding process
// exports.deleteOnboarding = async (req, res) => {
//   try {
//     const onboarding = await Onboarding.findOneAndDelete({ workspace: req.params.workspaceId });
//     if (!onboarding) return res.status(404).json({ message: 'Onboarding process not found' });

//     // Remove onboarding reference from workspace
//     await Workspace.findByIdAndUpdate(req.params.workspaceId, { $unset: { onboarding: 1 } });

//     // Optionally, delete all associated candidates
//     await Candidate.deleteMany({ workspace: req.params.workspaceId });

//     res.json({ message: 'Onboarding process deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// Create a new candidate
// POST /candidates
// payload: { workspaceId, candidateData... }
exports.createCandidate = async (req, res) => {
  try {
    const { workspaceId, ...candidateData } = req.body;
    
    // Check if workspace exists
    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) {
      return res.status(404).json({ message: 'Workspace not found' });
    }

    // Check if onboarding exists for the workspace
    const onboarding = await Onboarding.findOne({ workspace: workspaceId });
    if (!onboarding) {
      return res.status(404).json({ message: 'Onboarding process not found for this workspace' });
    }

    const candidate = new Candidate({ ...candidateData, workspace: workspaceId });
    await candidate.save();

    // Add candidate to onboarding
    onboarding.candidates.push(candidate._id);
    await onboarding.save();

    res.status(201).json(candidate);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get candidates by workspace
exports.getCandidatesByWorkspace = async (req, res) => {
  try {
    const { workspaceId } = req.params;

    const candidates = await Candidate.find({ workspace: workspaceId });
    res.status(200).json(candidates);
  } catch (error) {
    console.error('Error fetching candidates:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};