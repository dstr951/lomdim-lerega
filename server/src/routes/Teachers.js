const express = require("express");
const TeachersController = require("../controllers/Teachers");
const router = express.Router();

router.post("/", TeachersController.registerTeacher);
router.get("/all", TeachersController.getAllTeachers);

module.exports = router;
