const express = require('express');
const UsersController = require('../controllers/Users')
const router = express.Router();

router.post('/login',UsersController.loginUser);

module.exports = router;