const mongoose = require('mongoose').default;

const UserSchema = new mongoose.Schema({
    username:{
        type:String,
        unique: true,
        default: null,
        required:true

    },
    password:{
        type:String,
        default: null,
        required:true,
        validate: {
            validator: function (password) {
                // Check if the password length is greater than 7
                if (password.length <= 7) {
                    return false;
                }

                return true;
            },
            message: 'Password must be at least 8 characters long.'
        }
    },
    displayName:{
        type:String,
        default: null,
        required:true
    }
})

const User = mongoose.model('users', UserSchema)

module.exports = {User}