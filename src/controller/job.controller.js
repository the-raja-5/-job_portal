const Job = require("../model/job.model");
const Company = require("../model/company.model");

// POST /api/jobs  (Recruiter): post a job for their own company
exports.createJob = async (req, res) => {
    const { title, description, location, salary } = req.body;

    if (!req.user.company) {
        return res.status(400).json({ message: "Create your company first" });
    }

    const company = await Company.findById(req.user.company);
    if (!company.isVerified) {
        return res.status(403).json({ message: "Your company is not verified by admin yet" });
    }

    if (!title || !description) {
        return res.status(400).json({ message: "Title & Description are required" });
    }

    const job = await Job.create({
        title,
        description,
        location,
        salary,
        company: company._id,
        postedBy: req.user.id,
    });

    return res.status(201).json({ message: "Job posted", job });
};

// GET /api/jobs  (any logged-in user): list open jobs
exports.listOpenJobs = async (req, res) => {
    const jobs = await Job.find({ status: "open" })
        .populate("company", "name website isVerified")
        .sort({ createdAt: -1 });

    return res.status(200).json({ count: jobs.length, jobs });
};

// GET /api/jobs/mine  (Recruiter): jobs this recruiter posted
exports.myJobs = async (req, res) => {
    const jobs = await Job.find({ postedBy: req.user.id }).sort({ createdAt: -1 });
    return res.status(200).json({ count: jobs.length, jobs });
};

// GET /api/jobs/:id  (any logged-in user)
exports.getJob = async (req, res) => {
    const job = await Job.findById(req.params.id).populate("company", "name website isVerified");
    if (!job) {
        return res.status(404).json({ message: "Job not found" });
    }
    return res.status(200).json({ job });
};

// PATCH /api/jobs/:id/close  (Recruiter): only jobs of their own company
exports.closeJob = async (req, res) => {
    const job = await Job.findById(req.params.id);
    if (!job) {
        return res.status(404).json({ message: "Job not found" });
    }

    if (!req.user.company || job.company.toString() !== req.user.company) {
        return res.status(403).json({ message: "You can only close jobs of your own company" });
    }

    job.status = "closed";
    await job.save();

    return res.status(200).json({ message: "Job closed", job });
};
