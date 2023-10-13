const TeachingRequestsService = require("../services/TeachingRequests")
const jwt = require("jsonwebtoken")

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

async function getTeachingRequestsOfTeacher(req, res){
    const token = req.headers.authorization;
    let email;
    try {
    // Verify the token is valid
        const data = jwt.verify(token, process.env.JWT_KEY);
        email = data.email         
    } catch (err) {
        console.log(err)
        return res.status(401).send("Invalid Token");
    }
    if(!email) {
        console.log("token didn't contain an email")
        res.status(401).send("Invalid Token");
        return
    }
    const reachingRequestsResponse = await TeachingRequestsService.getTeachingRequestsOfTeacher(email)
    if (reachingRequestsResponse.status == 200) {
        res.status(200).send(reachingRequestsResponse.body);
    } else {
        res.status(reachingRequestsResponse.status).send(reachingRequestsResponse.error);
    }
}

module.exports = {
    createTeachingRequest,
    getTeachingRequestsOfTeacher,
}