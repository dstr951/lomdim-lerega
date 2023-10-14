const TeachingRequestsService = require("../services/TeachingRequests");
const jwt = require("jsonwebtoken");

async function createTeachingRequest(req, res) {
  const {
    studentEmail,
    teacherEmail,
    subject,
    messageContent,
    firstName: studentFirstName,
    lastName: studentLastName,
  } = req.body;
  if (
    !studentEmail ||
    !teacherEmail ||
    !subject ||
    !messageContent ||
    !studentFirstName ||
    !studentLastName
  ) {
    return res.status(400).send("bad request");
  }
  const requestResponse = await TeachingRequestsService.createTeachingRequest(
    studentEmail,
    teacherEmail,
    subject,
    messageContent,
    studentFirstName,
    studentLastName
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

async function getTeachingRequestsOfTeacher(req, res) {
  const token = req.headers.authorization;
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
  const reachingRequestsResponse =
    await TeachingRequestsService.getTeachingRequestsOfTeacher(email);
  if (reachingRequestsResponse.status == 200) {
    res.status(200).send(reachingRequestsResponse.body);
  } else {
    res
      .status(reachingRequestsResponse.status)
      .send(reachingRequestsResponse.error);
  }
}

module.exports = {
  createTeachingRequest,
  getTeachingRequestsOfTeacher,
  approveTeachingRequest,
  rejectTeachingRequest,
};
