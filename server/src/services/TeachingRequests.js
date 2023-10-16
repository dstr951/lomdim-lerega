const { TeachingRequests } = require("../models/TeachingRequests");
const StudentService = require("../services/Students");
const { creationServiceErrorHandler } = require("../commonFunctions");
const LoggerService = require("./Logger");
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
    LoggerService.log(
      `teaching request creationg failed teacherEmail:${teacherEmail}, studentEmail:${studentEmail}, ${getStudentResponse.error}`
    );
    //if error return the error to the controller
    return getStudentResponse;
  }
  const newTeachingRequests = new TeachingRequests({
    studentEmail,
    studentFirstName: getStudentResponse.body.student.firstName,
    studentLastName: getStudentResponse.body.student.lastName,
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
    LoggerService.log(
      `student ${studentEmail} created a request for the teacher ${teacherEmail} in the subject ${subject}`
    );
    return {
      status: 200,
      body: {
        requestId: savedRequest._id,
      },
    };
  } catch (error) {
    LoggerService.error(
      `teaching request creationg failed teacherEmail:${teacherEmail}, studentEmail:${studentEmail}, ${error}`
    );
    return creationServiceErrorHandler(error);
  }
}

async function getTeachingRequestsOfTeacher(teacherEmail, approved) {
  try {
    const teachingRequests = await TeachingRequests.find({ teacherEmail });
    const filteredRequests = teachingRequests?.filter(
      (item) => item.approved === approved
    );
    LoggerService.log(
      `teacher ${teacherEmail} asked for his requests in status:${approved}`
    );
    return {
      status: 200,
      body: filteredRequests,
    };
  } catch (error) {
    LoggerService.error(
      `teacher ${teacherEmail} tried to ask for requests  in status:${approved} but failed, ${error}`
    );
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
      LoggerService.error(
        `teacher tried to change status of request ${requestId} to ${status} but failed`
      );
      return {
        status: 404,
        error: "Could not update request",
      };
    }
    LoggerService.log(
      `teacher ${response.teacherEmail} change request ${requestId} to status ${status}`
    );
    return {
      status: 200,
      body: response,
    };
  } catch (error) {
    LoggerService.error(
      `teacher ${response.teacherEmail} tried to change request ${requestId} status to ${status} but failed, ${error}`
    );
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
