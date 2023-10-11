const express = require('express');
const TeachersController = require('../controllers/Teachers')
const router = express.Router();

router.post('/',TeachersController.registerTeacher);

module.exports = router;