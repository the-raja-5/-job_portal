const express = require("express");
const { protect, authorize } = require("../middleware/auth.middleware");
const { getProfile, updateProfile } = require("../controller/user.controller");

const router = express.Router();

router.get("/profile", protect, getProfile);
router.put("/profile", protect, authorize("Candidate"), updateProfile);

module.exports = router;
