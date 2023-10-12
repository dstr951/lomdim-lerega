const mongoose = require('mongoose').default;
const {validatePassword, validatePhoneNumber, validateCanTeach} = require('../commonFunctions')

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
            message: 'Password must be at least 8 characters long and contain only english letters, numbers and symbols'
        }
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    age:{
        type:Number,
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
            message: 'phone number must be numbers only'
        }
    },
    profilePicture:{
        type:String,
        required: true
    },
    aboutMe:{
        type: String,
        required: true,
    },
    canTeach: {
        type: [new mongoose.Schema({
            subject:{
                type: Number,
                required: true
            },
            lowerGrade:{
                type: Number,
                required: true
            },
            higherGrade:{
                type: Number,
                required: true
            },
        })],
        required: true,
        validate: {
            validator: validateCanTeach,
            message: 'you have to pick at least one subject'
        }
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