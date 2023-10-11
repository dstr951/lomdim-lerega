const express = require("express");
const TeachersController = require("../controllers/Teachers");
const router = express.Router();

router.post("/", TeachersController.registerTeacher);
router.post("/:email/approve", TeachersController.approveTeacher);
router.post("/:email/reject", TeachersController.rejectTeacher);
router.get("/all", TeachersController.getAllTeachers);

module.exports = router;
