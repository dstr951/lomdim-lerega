const mongoose = require('mongoose').default;
const { validatePhoneNumber, validatePassword } = require('../commonFunctions');

const StudentSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    parent: {
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        },
        phoneNumber: {
            type: String,
            required: true,
            validate: {
                validator: validatePhoneNumber,
                message: 'phone number must be of length 10'
            }
        }
    },
    student: {
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        },
        grade: {
            type: Number,
            required: true
        }
    }
});

const Student = mongoose.model('students', StudentSchema);

module.exports = { Student };