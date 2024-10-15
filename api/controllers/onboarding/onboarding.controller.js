const { Onboarding, Candidate, Workspace } = require('../../models/models');

// Create a new onboarding process
exports.createOnboarding = async (req, res) => {
  try {
    const { workspaceId, ...onboardingData } = req.body;
    const onboarding = new Onboarding(onboardingData);
    await onboarding.save();

    // Add onboarding to workspace
    if (workspaceId) {
      const workspace = await Workspace.findById(workspaceId);
      if (workspace) {
        workspace.onboardings.push(onboarding._id);
        await workspace.save();
      }
    }

    res.status(201).json(onboarding);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all onboarding processes
exports.getAllOnboardings = async (req, res) => {
  try {
    const onboardings = await Onboarding.find();
    res.json(onboardings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single onboarding process by ID
exports.getOnboardingById = async (req, res) => {
  try {
    const onboarding = await Onboarding.findById(req.params.id).populate('candidates');
    if (!onboarding) return res.status(404).json({ message: 'Onboarding process not found' });
    res.json(onboarding);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update an onboarding process
exports.updateOnboarding = async (req, res) => {
  try {
    const onboarding = await Onboarding.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!onboarding) return res.status(404).json({ message: 'Onboarding process not found' });
    res.json(onboarding);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete an onboarding process
exports.deleteOnboarding = async (req, res) => {
  try {
    const onboarding = await Onboarding.findByIdAndDelete(req.params.id);
    if (!onboarding) return res.status(404).json({ message: 'Onboarding process not found' });

    // Remove onboarding from workspace
    await Workspace.updateMany(
      { onboardings: onboarding._id },
      { $pull: { onboardings: onboarding._id } }
    );

    // Optionally, delete all associated candidates
    await Candidate.deleteMany({ _id: { $in: onboarding.candidates } });

    res.json({ message: 'Onboarding process deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new candidate
exports.createCandidate = async (req, res) => {
  try {
    const { onboardingId, ...candidateData } = req.body;
    const candidate = new Candidate(candidateData);
    await candidate.save();

    if (onboardingId) {
      const onboarding = await Onboarding.findById(onboardingId);
      if (onboarding) {
        onboarding.candidates.push(candidate._id);
        await onboarding.save();
      }
    }

    res.status(201).json(candidate);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all candidates
exports.getAllCandidates = async (req, res) => {
  try {
    const candidates = await Candidate.find();
    res.json(candidates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single candidate by ID
exports.getCandidateById = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);
    if (!candidate) return res.status(404).json({ message: 'Candidate not found' });
    res.json(candidate);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a candidate
exports.updateCandidate = async (req, res) => {
  try {
    const candidate = await Candidate.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!candidate) return res.status(404).json({ message: 'Candidate not found' });
    res.json(candidate);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a candidate
exports.deleteCandidate = async (req, res) => {
  try {
    const candidate = await Candidate.findByIdAndDelete(req.params.id);
    if (!candidate) return res.status(404).json({ message: 'Candidate not found' });

    // Remove candidate from onboarding process
    await Onboarding.updateMany(
      { candidates: candidate._id },
      { $pull: { candidates: candidate._id } }
    );

    res.json({ message: 'Candidate deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update candidate interview status
exports.updateCandidateInterviewStatus = async (req, res) => {
  try {
    const { interview_status } = req.body;
    const candidate = await Candidate.findByIdAndUpdate(
      req.params.id,
      { interview_status },
      { new: true, runValidators: true }
    );
    if (!candidate) return res.status(404).json({ message: 'Candidate not found' });
    res.json(candidate);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get candidates by onboarding process
exports.getCandidatesByOnboarding = async (req, res) => {
  try {
    const onboarding = await Onboarding.findById(req.params.onboardingId).populate('candidates');
    if (!onboarding) return res.status(404).json({ message: 'Onboarding process not found' });
    res.json(onboarding.candidates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};