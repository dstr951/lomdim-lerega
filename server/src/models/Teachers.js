const mongoose = require('mongoose').default;
const {validatePassword, validatePhoneNumber} = require('../commonFunctions')

const TeacherSchema = new mongoose.Schema({
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
            message: 'Password must be at least 8 characters long.'
        }
    },
    name:{
        type:String,
        required:true
    },
    dateOfBirth:{
        type:Date,
        required:true
    },
    socialProfileLink:{
        type:String,
        required:true
    },
    phoneNumber:{
        type:String,
        required: true,
        validate: {
            validator: validatePhoneNumber,
            message: 'phone number must be of length 10'
        }
    },
    profilePicture:{
        type:String,
        required: true
    },
    authenticated:{
        type:Boolean,
        default:false
    },
    registered:{
        type:Date,
        default: Date.now
    }

})

const Teacher = mongoose.model('teachers', TeacherSchema)

module.exports = {Teacher}