const express = require("express");
const TeachersController = require("../controllers/Teachers");
const TokensService = require("../services/Tokens");
const router = express.Router();

module.exports = router;

router.post("/", TeachersController.registerTeacher);
router.get("/search", TeachersController.searchTeachers);
router.get("/all", TeachersController.getAllTeachers);
