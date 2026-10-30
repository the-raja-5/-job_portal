const User = require("../model/user.model");

// GET /api/users/profile  (any logged-in user)
exports.getProfile = async (req, res) => {
    const user = await User.findById(req.user.id);
    return res.status(200).json({
        message: "Welcome to your profile",
        user,
    });
};

// PUT /api/users/profile  (Candidate only): create / update candidate profile
exports.updateProfile = async (req, res) => {
    const { headline, phone, skills, experience } = req.body;

    const user = await User.findByIdAndUpdate(
        req.user.id,
        {
            $set: {
                "profile.headline": headline,
                "profile.phone": phone,
                "profile.skills": skills,
                "profile.experience": experience,
            },
        },
        { new: true, runValidators: true }
    );

    return res.status(200).json({
        message: "Profile updated",
        user,
    });
};
