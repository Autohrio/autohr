const { Onboarding, Candidate, Workspace } = require('../../models/models');
const mongoose = require('mongoose');

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

// Delete an candidate from Workspace and Onboarding
exports.removeCandidateFromWorkspace = async (req, res) => {
  try {
    const { workspaceId, candidateId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(workspaceId) || !mongoose.Types.ObjectId.isValid(candidateId)) {
      return res.status(400).json({ message: 'Invalid workspaceId or candidateId' });
    }

    // Find and remove the candidate
    const candidate = await Candidate.findOneAndDelete({ 
      _id: candidateId,
      workspace: workspaceId
    });

    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found in the specified workspace' });
    }

    await Onboarding.updateOne(
      { workspace: workspaceId },
      { $pull: { candidates: candidateId } }
    );

    // Remove onboarding from workspace if it's empty
    const onboarding = await Onboarding.findOne({ workspace: workspaceId });
    if (onboarding && onboarding.candidates.length === 0) {
      await Onboarding.findByIdAndDelete(onboarding._id);
      await Workspace.updateOne(
        { _id: workspaceId },
        { $pull: { onboardings: onboarding._id } }
      );
    }

    res.json({ message: 'Candidate removed successfully from the workspace and onboarding process' });
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while removing the candidate', error: error.message });
  }
};

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

// patch candidate from workspace
exports.patchCandidateFromWorkspace = async (req, res) => {
  const { workspaceId, candidateId } = req.params;
  const updateData = req.body;

  try {
    // Check if the workspace exists
    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) {
      return res.status(404).json({ message: 'Workspace not found' });
    }

    // Find the candidate and update
    const candidate = await Candidate.findOneAndUpdate(
      { _id: candidateId, workspace: workspaceId },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found in the specified workspace' });
    }

    res.status(200).json(candidate);
  } catch (error) {
    console.error('Error in patchCandidate:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Invalid data', errors: error.errors });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};