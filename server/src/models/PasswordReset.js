const {User} = require("./Users");
const mongoose = require('mongoose').default;
const moment = require('moment-timezone');
const IsraelTimeZone = 'Israel/Jerusalem'


const PasswordResetSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
        validate : {
            validator: validateEmail ,
            massage: 'operation failed'
        }

    },
    expirationDate: {
        type: Date,
        required: true
    },
    token: {
        type: String,
        unique: true,
        required: true
    }
});
async function validateEmail(email){
    try {
        const user = await User.findOne({ email });
        if(user){
            return true;
        }
        else{
            console.log("no user with this email address");
            return false;
        }
    }
    catch (e) {
        console.log(e)
        return false;
    }
}

async function deleteExpiredPasswordResets() {
    try {
        // Calculate the threshold time (10 minutes ago from the current time)
        const thresholdTime = new Date();
        thresholdTime.setMinutes(thresholdTime.getMinutes() - 10);

        // Use the $lt operator to find records with expirationDate less than the threshold time
        const result = await PasswordReset.deleteMany({ expirationDate: { $lt: thresholdTime } });

        console.log(`Deleted ${result.deletedCount} expired password reset records.`);
    } catch (error) {
        console.error('Error deleting expired password reset records:', error);
    }
}

const PasswordReset = mongoose.model('PasswordReset', PasswordResetSchema);

module.exports = { PasswordReset, deleteExpiredPasswordResets};
