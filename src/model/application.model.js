const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
    {
        job: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "job",
            required: true,
        },
        candidate: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true,
        },
        status: {
            type: String,
            enum: ["Applied", "Shortlisted", "Rejected"],
            default: "Applied",
        },
    },
    { timestamps: true }
);

// A candidate can apply to the same job only once
applicationSchema.index({ job: 1, candidate: 1 }, { unique: true });

const applicationModel = mongoose.model("application", applicationSchema);

module.exports = applicationModel;
