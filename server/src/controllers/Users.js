const UserService  = require("../services/Users");
const TeachersService  = require("../services/Teachers");

async function registerUser(req,res) {
    const registerUserResponse = await UserService.registerUser(
        req.body.username,
        req.body.password,
        req.body.displayName)
    if(registerUserResponse.status === 200) {
        res.status(200).send(registerUserResponse.body)
    } else {
        res.status(registerUserResponse.status).send(registerUserResponse.error)
    }    
}

async function loginUser(req, res) {
    const {email, password} = req.body
    const loginTeacherResponse = await TeachersService.loginTeacher(email, password)
    if(loginTeacherResponse.status === 200) {
        res.status(200).send(loginTeacherResponse.body)
    } else if(loginTeacherResponse.status !== 404) {
        res.status(loginTeacherResponse.status).send(loginTeacherResponse.error)
    } else {
        res.status(loginTeacherResponse.status).send(loginTeacherResponse.error)
        //try logging in as a student
    }
}

module.exports = {
    loginUser,
}