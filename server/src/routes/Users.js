const express = require('express');
const UsersController = require('../controllers/Users')
const router = express.Router();

router.post('/',UsersController.registerUser);

module.exports = router;