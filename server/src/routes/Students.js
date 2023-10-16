const express = require("express");
const StudentsController = require("../controllers/Students");
const TokensService = require("../services/Tokens");
const TeachersController = require("../controllers/Teachers");
const router = express.Router();

router.get(
  "/myself",
  StudentsController.getMyselfStudent
);

router.get(
    "/all/admin",
    StudentsController.getAllStudentsAdmin
);

router.post("/", StudentsController.registerStudent);

router.post(
  "/:email/approve",
  StudentsController.approveStudent
);

router.post(
  "/:email/reject",
  StudentsController.rejectStudent
);

module.exports = router;
