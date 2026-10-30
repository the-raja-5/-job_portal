const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Job title is required"],
            trim: true,
        },
        description: {
            type: String,
            required: [true, "Job description is required"],
        },
        location: String,
        salary: Number,
        company: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "company",
            required: true,
        },
        // The recruiter who posted this job
        postedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true,
        },
        status: {
            type: String,
            enum: ["open", "closed"],
            default: "open",
        },
    },
    { timestamps: true }
);

const jobModel = mongoose.model("job", jobSchema);

module.exports = jobModel;
