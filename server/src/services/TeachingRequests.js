const { TeachingRequests } = require("../models/TeachingRequests");
const StudentService = require("../services/Students");
const { creationServiceErrorHandler } = require("../commonFunctions");
const TEACHING_REQUESTS_SERVICE_DEBUG = false;

async function createTeachingRequest(
  studentEmail,
  teacherEmail,
  subject,
  messageContent
) {
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
    messageContent,
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

async function getTeachingRequestsOfTeacher(teacherEmail) {
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

async function getTeachingRequestById(id) {
  try {
    const requestResponse = await TeachingRequests.findOne({ _id: id });
    if (!requestResponse) {
      return {
        status: 404,
        error: "Could not find request",
      };
    }
    return {
      status: 200,
      body: requestResponse,
    };
  } catch (error) {
    console.log("error: ", error);
    return {
      status: 500,
      error,
    };
  }
}

module.exports = {
  createTeachingRequest,
  updateTeachingRequest,
  getTeachingRequestsOfTeacher,
  getTeachingRequestById,
};
