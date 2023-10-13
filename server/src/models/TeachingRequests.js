const mongoose = require('mongoose').default;

const TeachingRequestsSchema = new mongoose.Schema({
    studentEmail:{
        type:String,
        required:true
    },
    teacherEmail:{
        type:String,
        required:true
    },
    subject: {
        type: Number,
        required: true
    },
    grade: {
        type: Number,
        required: true
    },
    approved: {
       type: Boolean,
       default: null 
    },
    created: {
        type: Date,
        default: Date.now
    }
})

TeachingRequestsSchema.index( { studentEmail: 1, teacherEmail: 1 }, { unique: true } )

const TeachingRequests = mongoose.model('teachingRequest', TeachingRequestsSchema)

module.exports = {TeachingRequests}