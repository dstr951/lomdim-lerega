const express = require("express");
const TeachersController = require("../controllers/Teachers");
const TokensService = require("../services/Tokens");
const router = express.Router();

router.get(
  "/search",
  TokensService.isLoggedIn,
  TokensService.isAuthenticated,
  TeachersController.searchTeachers
);
router.get("/all", TokensService.isLoggedIn, TeachersController.getAllTeachers);
router.get(
  "/:email/profilePicture",
  TokensService.isLoggedIn,
  TeachersController.getPictureOfTeacher
);

router.get(
  "/all/admin",
  TokensService.isAdmin,
  TeachersController.getAllTeachersAdmin
);
router.post("/", TeachersController.registerTeacher);
router.post(
  "/:email/approve",
  TokensService.isAdmin,
  TeachersController.approveTeacher
);
router.post(
  "/:email/reject",
  TokensService.isAdmin,
  TeachersController.rejectTeacher
);

module.exports = router;
