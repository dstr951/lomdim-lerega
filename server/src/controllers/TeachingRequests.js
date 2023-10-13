const TeachingRequestsService = require("../services/TeachingRequests");

async function createTeachingRequest(req, res) {
<<<<<<< HEAD
  const { studentEmail, teacherEmail, subject } = req.body;
  if (!studentEmail || !teacherEmail || !subject) {
=======
  const { studentEmail, teacherEmail, subject, messageContent } = req.body;
  if (!studentEmail || !teacherEmail || !subject || !messageContent) {
>>>>>>> 55a70f8644f016c21bf2015ac992b0fb43dc8fa3
    return res.status(400).send("bad request");
  }
  const requestResponse = await TeachingRequestsService.createTeachingRequest(
    studentEmail,
    teacherEmail,
<<<<<<< HEAD
    subject
=======
    subject,
    messageContent
>>>>>>> 55a70f8644f016c21bf2015ac992b0fb43dc8fa3
  );
  if (requestResponse.status === 200) {
    return res.status(200).send(requestResponse.body);
  }
  return res.status(requestResponse.status).send(requestResponse.body);
<<<<<<< HEAD
}

async function approveTeachingRequest(req, res) {
  const requestId = req.params.requestId;
  const approvalResponse = await TeachingRequestsService.updateTeachingRequest(
    requestId,
    true
  );
  if (approvalResponse.status == 200) {
    res.status(200).send(approvalResponse.body);
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
=======
>>>>>>> 55a70f8644f016c21bf2015ac992b0fb43dc8fa3
}

module.exports = {
  createTeachingRequest,
<<<<<<< HEAD
  approveTeachingRequest,
  rejectTeachingRequest,
=======
>>>>>>> 55a70f8644f016c21bf2015ac992b0fb43dc8fa3
};
