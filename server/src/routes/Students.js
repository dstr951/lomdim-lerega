const express = require("express");
const StudentsController = require("../controllers/Students");
const TokensService = require("../services/Tokens");
const router = express.Router();

router.get(
  "/myself",
  TokensService.isStudent,
  StudentsController.getMyselfStudent
);

router.post("/", StudentsController.registerStudent);

router.post(
  "/:email/approve",
  TokensService.isAdmin,
  StudentsController.approveStudent
);

router.post(
  "/:email/reject",
  TokensService.isAdmin,
  StudentsController.rejectStudent
);

module.exports = router;
