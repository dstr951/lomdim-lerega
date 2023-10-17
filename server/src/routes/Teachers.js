const express = require("express");
const TeachersController = require("../controllers/Teachers");
const TokensService = require("../services/Tokens");
const router = express.Router();

router.get(
  "/search",
  TokensService.isLoggedIn,
  TeachersController.searchTeachers
);
router.get("/all", TeachersController.getAllTeachers);

router.get(
  "/all/admin",
  TeachersController.getAllTeachersAdmin
);
router.post("/", TeachersController.registerTeacher);
router.post(
  "/:email/approve",
  TeachersController.approveTeacher
);
router.post(
  "/:email/reject",
  TeachersController.rejectTeacher
);

module.exports = router;
