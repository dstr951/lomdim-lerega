const cron = require('node-cron');
const {deleteExpiredPasswordResets} = require("../models/PasswordReset");

// delete all un-used links to reset password from this day
const resetPasswordCleanTime = '0 4 * * *'
cron.schedule(resetPasswordCleanTime, ()=>{
    console.log("doing periodic task- clean up reset password links");
    deleteExpiredPasswordResets();
});


