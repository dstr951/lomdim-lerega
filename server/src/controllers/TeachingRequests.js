const TeachingRequestsService = require("../services/TeachingRequests")

async function createTeachingRequest(req, res) {
    const {studentEmail, teacherEmail, subject} = req.body
    if(!studentEmail || !teacherEmail || !subject) {
        return res.status(400).send("bad request")
    }
    const requestResponse = await TeachingRequestsService.createTeachingRequest(studentEmail, teacherEmail, subject)
    if(requestResponse.status === 200) {
        return res.status(200).send(requestResponse.body)
    }
    return res.status(requestResponse.status).send(requestResponse.body)
}

module.exports = {
    createTeachingRequest,
}