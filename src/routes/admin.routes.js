const express = require("express");
const { protect, authorize } = require("../middleware/auth.middleware");
const {
    getAllUsers,
    setUserBlocked,
    getAllCompanies,
    setCompanyVerified,
    getAllJobs,
    setJobStatus,
} = require("../controller/admin.controller");

const router = express.Router();

// Every admin route requires a logged-in Admin
router.use(protect, authorize("Admin"));

router.get("/users", getAllUsers);
router.patch("/users/:id/block", setUserBlocked);
router.get("/companies", getAllCompanies);
router.patch("/companies/:id/verify", setCompanyVerified);
router.get("/jobs", getAllJobs);
router.patch("/jobs/:id/status", setJobStatus);

module.exports = router;
