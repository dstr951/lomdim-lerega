const express = require("express");
const TeachersController = require("../controllers/Teachers");
const TokensService = require("../services/Tokens");
const router = express.Router();

module.exports = router;

router.post("/", TokensService.isLoggedIn, TeachersController.registerTeacher);
router.get("/search", TokensService.isLoggedIn, TeachersController.searchTeachers);
router.get("/all", TokensService.isLoggedIn, TeachersController.getAllTeachers);
