const { TeachingRequests } = require("../models/TeachingRequests")
const StudentService = require("../services/Students")
const { creationServiceErrorHandler } = require("../commonFunctions")
const TEACHING_REQUESTS_SERVICE_DEBUG = false

async function createTeachingRequest(studentEmail, teacherEmail, subject){
    const getStudentResponse = await StudentService.getStudentByEmail(studentEmail)
    if(getStudentResponse.status !== 200) {
        //if error return the error to the controller
        return getStudentResponse
    }
    const newTeachingRequests = new TeachingRequests({
        studentEmail,
        teacherEmail,
        subject,
        grade: getStudentResponse.body.student.grade
    }) 
    try {
        const savedRequest = await newTeachingRequests.save();
        if(TEACHING_REQUESTS_SERVICE_DEBUG){
            console.log('Request saved successfully:', newTeachingRequests);
        }
        return {
            status:200,
            body:{
                requestId: savedRequest._id
            }
        };
    }
    catch (error){
        console.log(error);
        return creationServiceErrorHandler(error);
    }
}

async function getTeachingRequestsOfTeacher(teacherEmail){
    try {
        const teachingRequest = await TeachingRequests.find({ teacherEmail });
        return {
          status: 200,
          body: teachingRequest,
        };
      } catch (error) {
        console.log(error);
        return {
          status: 500,
          body: error,
        };
    }
}

module.exports = {
    createTeachingRequest,
    getTeachingRequestsOfTeacher,
}