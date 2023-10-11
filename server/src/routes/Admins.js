const express = require('express');
const AdminsController = require('../controllers/Admins')
const router = express.Router();

router.post('/login',AdminsController.loginAdmin);

module.exports = router;