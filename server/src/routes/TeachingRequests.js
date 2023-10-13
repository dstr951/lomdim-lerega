const express = require("express");
const TeachingRequestsController = require("../controllers/TeachingRequests");
const TokensService = require("../services/Tokens");
// const TeachingRequestsServices = require("../services/TeachingRequests");
const router = express.Router();

router.post(
  "/",
  TokensService.isStudent,
  TeachingRequestsController.createTeachingRequest
);
router.post(
  "/:requestId/approve",
  TokensService.isTeacher,
  TeachingRequestsController.approveTeachingRequest
);
router.post(
  "/:requestId/reject",
  TokensService.isTeacher,
  TeachingRequestsController.rejectTeachingRequest
);

module.exports = router;
