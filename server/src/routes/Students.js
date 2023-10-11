const express = require('express');
const StudentsController = require('../controllers/Students')
const router = express.Router();

router.post('/',StudentsController.registerStudent);

module.exports = router;