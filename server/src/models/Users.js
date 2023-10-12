const mongoose = require('mongoose').default;
const {validatePassword} = require('../commonFunctions')

const UserSchema = new mongoose.Schema({
    email:{
        type:String,
        unique: true,
        required:true

    },
    password:{
        type:String,
        required:true,
        validate: {
            validator: validatePassword,
            message: 'Password must be at least 8 characters long and contain only english letters, numbers and symbols'
        }
    },
    role:{
        type:String,
        required: true,
        validate:{
            validator: role => {
                if(["admin","student", "teacher"].includes(role)){
                    return true;
                }
                return false;
            },
            message: `This role doesn't exist`
        }
    },
    registered:{
        type:Date,
        default: Date.now
    },
    authenticated:{
        type:Boolean,
        default:null
    }
})

const User = mongoose.model('users', UserSchema)

module.exports = {User}