const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            select: false,
        },
        role: {
            type: String,
            enum: ["Admin", "Recruiter", "Candidate"],
            required: [true, "Role is required"],
        },
        isBlocked: {
            type: Boolean,
            default: false,
        },
        // Only for Recruiters: the company they belong to
        company: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "company",
            default: null,
        },
        // Only for Candidates
        profile: {
            headline: String,
            phone: String,
            skills: [String],
            experience: String,
        },
    },
    { timestamps: true }
);

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;
