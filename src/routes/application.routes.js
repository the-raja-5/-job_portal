const express = require("express");
const { protect, authorize } = require("../middleware/auth.middleware");
const {
    applyToJob,
    myApplications,
    jobApplicants,
    updateApplicationStatus,
} = require("../controller/application.controller");

const router = express.Router();

router.use(protect);

router.post("/jobs/:jobId", authorize("Candidate"), applyToJob);
router.get("/mine", authorize("Candidate"), myApplications);
router.get("/job/:jobId", authorize("Recruiter"), jobApplicants);
router.patch("/:id/status", authorize("Recruiter"), updateApplicationStatus);

module.exports = router;
