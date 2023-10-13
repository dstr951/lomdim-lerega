const TeachingRequestsService = require("../services/TeachingRequests");

async function createTeachingRequest(req, res) {
  const { studentEmail, teacherEmail, subject } = req.body;
  if (!studentEmail || !teacherEmail || !subject) {
    return res.status(400).send("bad request");
  }
  const requestResponse = await TeachingRequestsService.createTeachingRequest(
    studentEmail,
    teacherEmail,
    subject
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

module.exports = {
  createTeachingRequest,
  approveTeachingRequest,
  rejectTeachingRequest,
};
