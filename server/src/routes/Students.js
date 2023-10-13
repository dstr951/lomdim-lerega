const express = require('express');
const StudentsController = require('../controllers/Students')
const TokensService = require("../services/Tokens")
const router = express.Router();

router.post('/', StudentsController.registerStudent);
router.get('/myself', TokensService.isStudent, StudentsController.getMyselfStudent);

module.exports = router;