const express = require("express");
const { protect, authorize } = require("../middleware/auth.middleware");
const {
    createJob,
    listOpenJobs,
    myJobs,
    getJob,
    closeJob,
} = require("../controller/job.controller");

const router = express.Router();

router.get("/", protect, listOpenJobs);
router.get("/mine", protect, authorize("Recruiter"), myJobs); // must be before "/:id"
router.post("/", protect, authorize("Recruiter"), createJob);
router.get("/:id", protect, getJob);
router.patch("/:id/close", protect, authorize("Recruiter"), closeJob);

module.exports = router;
