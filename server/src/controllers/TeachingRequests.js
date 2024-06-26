const TeachingRequestsService = require("../services/TeachingRequests");
const TeachersService = require("../services/Teachers");
const StudentsService = require("../services/Students");
const EmailingService = require("../services/EmailingResend");
const jwt = require("jsonwebtoken");

async function createTeachingRequest(req, res) {
  const { studentEmail, teacherEmail, subject, messageContent } = req.body;
  if (!studentEmail || !teacherEmail || !subject || !messageContent) {
    return res.status(400).send("bad request");
  }
  const requestResponse = await TeachingRequestsService.createTeachingRequest(
    studentEmail,
    teacherEmail,
    subject,
    messageContent
  );
  if (requestResponse.status === 200) {
    return res.status(200).send(requestResponse.body);
  }
  return res.status(requestResponse.status).send(requestResponse.body);
}

async function approveTeachingRequest(req, res) {
  const requestId = req.params.requestId;
  const approvalResponse = await TeachingRequestsService.updateTeachingRequest(
    requestId,
    true
  );
  if (approvalResponse.status == 200) {
    res.status(200).send(approvalResponse.body);
    const requestResponse =
      await TeachingRequestsService.getTeachingRequestById(requestId);
    if (requestResponse.status !== 200) {
      return res.status(requestResponse.status).send(requestResponse.error);
    }
    const authorized = false;
    const sensitive = true;
    const dbResponses = await Promise.all([
      StudentsService.getStudentByEmail(requestResponse.body.studentEmail),
      TeachersService.getTeacherByEmail(
        requestResponse.body.teacherEmail,
        authorized,
        sensitive
      ),
    ]);
    const student = dbResponses[0].body;
    const teacher = dbResponses[1].body;
    EmailingService.notifyMatch(requestResponse.body, student, teacher);
  } else {
    res.status(approvalResponse.status).send(approvalResponse.error);
  }
}

async function rejectTeachingRequest(req, res) {
  const requestId = req.params.requestId;
  const rejectionResponse = await TeachingRequestsService.updateTeachingRequest(
    requestId,
    false
  );
  if (rejectionResponse.status == 200) {
    res.status(200).send(rejectionResponse.body);
  } else {
    res.status(rejectionResponse.status).send(rejectionResponse.error);
  }
}

async function getTeachingRequestsOfTeacher(req, res) {
  const token = req.headers.authorization;
  const { approved } = req.query;
  let boolApproved = null;
  if (approved) {
    boolApproved = approved === "true";
  }
  let email;
  try {
    // Verify the token is valid
    const data = jwt.verify(token, process.env.JWT_KEY);
    email = data.email;
  } catch (err) {
    console.log(err);
    return res.status(401).send("Invalid Token");
  }
  if (!email) {
    console.log("token didn't contain an email");
    res.status(401).send("Invalid Token");
    return;
  }
  const teachingRequestsResponse =
    await TeachingRequestsService.getTeachingRequestsOfTeacher(
      email,
      boolApproved
    );
  if (teachingRequestsResponse.status == 200) {
    res.status(200).send(teachingRequestsResponse.body);
  } else {
    res
      .status(teachingRequestsResponse.status)
      .send(teachingRequestsResponse.error);
  }
}

module.exports = {
  createTeachingRequest,
  getTeachingRequestsOfTeacher,
  approveTeachingRequest,
  rejectTeachingRequest,
};
