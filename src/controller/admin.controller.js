const User = require("../model/user.model");
const Company = require("../model/company.model");
const Job = require("../model/job.model");

// GET /api/admin/users
exports.getAllUsers = async (req, res) => {
    const users = await User.find().sort({ createdAt: -1 });
    return res.status(200).json({ count: users.length, users });
};

// PATCH /api/admin/users/:id/block   body: { isBlocked: true|false }
exports.setUserBlocked = async (req, res) => {
    const { isBlocked = true } = req.body;

    const target = await User.findById(req.params.id);
    if (!target) {
        return res.status(404).json({ message: "User not found" });
    }
    if (target.role === "Admin") {
        return res.status(400).json({ message: "Admin accounts cannot be blocked" });
    }

    target.isBlocked = Boolean(isBlocked);
    await target.save();

    return res.status(200).json({
        message: target.isBlocked ? "User blocked" : "User unblocked",
        user: { id: target._id, name: target.name, role: target.role, isBlocked: target.isBlocked },
    });
};

// GET /api/admin/companies
exports.getAllCompanies = async (req, res) => {
    const companies = await Company.find()
        .populate("createdBy", "name email")
        .sort({ createdAt: -1 });
    return res.status(200).json({ count: companies.length, companies });
};

// PATCH /api/admin/companies/:id/verify   body: { isVerified: true|false }
exports.setCompanyVerified = async (req, res) => {
    const { isVerified = true } = req.body;

    const company = await Company.findByIdAndUpdate(
        req.params.id,
        { isVerified: Boolean(isVerified) },
        { new: true }
    );
    if (!company) {
        return res.status(404).json({ message: "Company not found" });
    }

    return res.status(200).json({
        message: company.isVerified ? "Company verified" : "Company verification removed",
        company,
    });
};

// GET /api/admin/jobs
exports.getAllJobs = async (req, res) => {
    const jobs = await Job.find()
        .populate("company", "name isVerified")
        .populate("postedBy", "name email")
        .sort({ createdAt: -1 });
    return res.status(200).json({ count: jobs.length, jobs });
};

// PATCH /api/admin/jobs/:id/status   body: { status: "open" | "closed" }
exports.setJobStatus = async (req, res) => {
    const { status } = req.body;
    if (!["open", "closed"].includes(status)) {
        return res.status(400).json({ message: "Status must be open or closed" });
    }

    const job = await Job.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!job) {
        return res.status(404).json({ message: "Job not found" });
    }

    return res.status(200).json({ message: `Job set to ${status}`, job });
};
