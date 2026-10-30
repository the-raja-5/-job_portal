const Company = require("../model/company.model");
const User = require("../model/user.model");

// POST /api/companies  (Recruiter): create company, starts as unverified
exports.createCompany = async (req, res) => {
    const { name, website, description } = req.body;

    if (!name) {
        return res.status(400).json({ message: "Company name is required" });
    }
    if (req.user.company) {
        return res.status(400).json({ message: "You already have a company" });
    }

    const exists = await Company.findOne({ name: name.trim() });
    if (exists) {
        return res.status(409).json({ message: "Company name already exists" });
    }

    const company = await Company.create({
        name,
        website,
        description,
        createdBy: req.user.id,
    });

    await User.findByIdAndUpdate(req.user.id, { company: company._id });

    return res.status(201).json({
        message: "Company created. Waiting for admin verification.",
        company,
    });
};

// GET /api/companies/mine  (Recruiter)
exports.getMyCompany = async (req, res) => {
    if (!req.user.company) {
        return res.status(404).json({ message: "You have not created a company yet" });
    }

    const company = await Company.findById(req.user.company);
    return res.status(200).json({ company });
};
