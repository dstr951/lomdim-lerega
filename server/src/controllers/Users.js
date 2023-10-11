const UserService  = require("../services/Users");
const TeachersService  = require("../services/Teachers");
const StudentsService  = require("../services/Students");

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
    const teacherResponseLogin = await TeachersService.loginTeacher(email, password)
    if(teacherResponseLogin.status === 200) {
        res.status(200).send(teacherResponseLogin.body)
    } else if(teacherResponseLogin.status !== 404) {
        res.status(teacherResponseLogin.status).send(teacherResponseLogin.error)
    } else {
        const studentResponseLogin = await StudentsService.loginStudent(email, password)
        if(studentResponseLogin.status === 200) {
            res.status(200).send(studentResponseLogin.body)
        } else if(studentResponseLogin.status === 404) {
            res.status(studentResponseLogin.status).send("couldn't find a user with those credetials")
        } else {
            res.status(studentResponseLogin.status).send(studentResponseLogin.error)
        }
    }
}

module.exports = {
    loginUser,
}