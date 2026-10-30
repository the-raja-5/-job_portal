const Application = require("../model/application.model");
const Job = require("../model/job.model");

// POST /api/applications/jobs/:jobId  (Candidate): apply to a job
exports.applyToJob = async (req, res) => {
    const job = await Job.findById(req.params.jobId);
    if (!job) {
        return res.status(404).json({ message: "Job not found" });
    }
    if (job.status !== "open") {
        return res.status(400).json({ message: "This job is closed" });
    }

    try {
        const application = await Application.create({
            job: job._id,
            candidate: req.user.id,
        });
        return res.status(201).json({ message: "Applied successfully", application });
    } catch (err) {
        // Unique index (job + candidate) violated => already applied
        if (err.code === 11000) {
            return res.status(409).json({ message: "You have already applied to this job" });
        }
        throw err;
    }
};

// GET /api/applications/mine  (Candidate): only their own applications
exports.myApplications = async (req, res) => {
    const applications = await Application.find({ candidate: req.user.id })
        .populate("job", "title location status company")
        .sort({ createdAt: -1 });

    return res.status(200).json({ count: applications.length, applications });
};

// GET /api/applications/job/:jobId  (Recruiter): applicants of jobs THEY posted only
exports.jobApplicants = async (req, res) => {
    const job = await Job.findById(req.params.jobId);
    if (!job) {
        return res.status(404).json({ message: "Job not found" });
    }
    if (job.postedBy.toString() !== req.user.id) {
        return res.status(403).json({ message: "You can only view applicants of jobs you posted" });
    }

    const applications = await Application.find({ job: job._id })
        .populate("candidate", "name email profile")
        .sort({ createdAt: -1 });

    return res.status(200).json({ count: applications.length, applications });
};

// PATCH /api/applications/:id/status  (Recruiter): shortlist or reject
exports.updateApplicationStatus = async (req, res) => {
    const { status } = req.body;
    if (!["Shortlisted", "Rejected"].includes(status)) {
        return res.status(400).json({ message: "Status must be Shortlisted or Rejected" });
    }

    const application = await Application.findById(req.params.id).populate("job");
    if (!application || !application.job) {
        return res.status(404).json({ message: "Application not found" });
    }
    if (application.job.postedBy.toString() !== req.user.id) {
        return res.status(403).json({ message: "You can only update applications for jobs you posted" });
    }

    application.status = status;
    await application.save();

    return res.status(200).json({ message: `Application ${status.toLowerCase()}`, application });
};
