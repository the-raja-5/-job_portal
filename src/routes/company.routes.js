const express = require("express");
const { protect, authorize } = require("../middleware/auth.middleware");
const { createCompany, getMyCompany } = require("../controller/company.controller");

const router = express.Router();

router.post("/", protect, authorize("Recruiter"), createCompany);
router.get("/mine", protect, authorize("Recruiter"), getMyCompany);

module.exports = router;
