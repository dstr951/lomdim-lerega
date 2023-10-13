const express = require('express');
const TeachingRequestsController = require('../controllers/TeachingRequests')
const TokensService = require("../services/Tokens")
const router = express.Router();

router.post('/', TokensService.isStudent, TeachingRequestsController.createTeachingRequest);

module.exports = router;