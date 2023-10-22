const express = require('express');
const UsersController = require('../controllers/Users')
const router = express.Router();
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 5, // 5 requests per minute
    message: 'Too many requests from this IP, please try again later.',
});

router.post('/login',UsersController.loginUser);
//limit the number of times it is possible to request password reset
router.post('/resetPassword',limiter,UsersController.resetPasswordLink);
router.put('/resetPassword/:token',UsersController.restPassword);

module.exports = router;