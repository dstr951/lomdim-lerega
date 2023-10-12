const express = require("express");
const TeachersController = require("../controllers/Teachers");
const TokensService = require("../services/Tokens")
const router = express.Router();

router.post("/", TeachersController.registerTeacher);
router.get('/search', TokensService.isLoggedIn, TeachersController.searchTeachers);
router.post("/:email/approve", TokensService.isAdmin, TeachersController.approveTeacher);
router.post("/:email/reject", TokensService.isAdmin, TeachersController.rejectTeacher);
router.get("/all", TokensService.isLoggedIn, TeachersController.getAllTeachers);

module.exports = router;
