const { TeachingRequests } = require("../models/TeachingRequests");
const StudentService = require("../services/Students");
const { creationServiceErrorHandler } = require("../commonFunctions");
const TEACHING_REQUESTS_SERVICE_DEBUG = false;

<<<<<<< HEAD
async function createTeachingRequest(studentEmail, teacherEmail, subject) {
=======
async function createTeachingRequest(
  studentEmail,
  teacherEmail,
  subject,
  messageContent
) {
>>>>>>> 55a70f8644f016c21bf2015ac992b0fb43dc8fa3
  const getStudentResponse = await StudentService.getStudentByEmail(
    studentEmail
  );
  if (getStudentResponse.status !== 200) {
    //if error return the error to the controller
    return getStudentResponse;
  }
  const newTeachingRequests = new TeachingRequests({
    studentEmail,
    teacherEmail,
    subject,
<<<<<<< HEAD
=======
    messageContent,
>>>>>>> 55a70f8644f016c21bf2015ac992b0fb43dc8fa3
    grade: getStudentResponse.body.student.grade,
  });
  try {
    const savedRequest = await newTeachingRequests.save();
    if (TEACHING_REQUESTS_SERVICE_DEBUG) {
      console.log("Request saved successfully:", newTeachingRequests);
    }
    return {
      status: 200,
      body: {
        requestId: savedRequest._id,
      },
    };
  } catch (error) {
    console.log(error);
    return creationServiceErrorHandler(error);
  }
}

<<<<<<< HEAD
async function updateTeachingRequest(requestId, status) {
  try {
    const filter = { _id: requestId };
    const update = { approved: status };
    const response = await TeachingRequests.findOneAndUpdate(filter, update);
    if (!response) {
      return {
        status: 404,
        error: "Could not update request",
      };
    }
    return {
      status: 200,
      body: response,
    };
  } catch (error) {
    console.log("error: ", error);
    return {
      status: 500,
      error,
    };
  }
}

module.exports = { createTeachingRequest, updateTeachingRequest };
=======
module.exports = { createTeachingRequest };
>>>>>>> 55a70f8644f016c21bf2015ac992b0fb43dc8fa3
