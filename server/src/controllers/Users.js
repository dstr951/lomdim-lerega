const UserService  = require("../services/Users");
const TeachersService  = require("../services/Teachers");
const StudentsService  = require("../services/Students");
const AdminsService  = require("../services/Admins");

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
    //todo: refactor the db to user table with role based on the role choose the correct service
    const [teacherResponseLogin, studentResponseLogin, adminResponseLogin] = await Promise.all([
        TeachersService.loginTeacher(email, password), 
        StudentsService.loginStudent(email, password),
        AdminsService.loginAdmin(email, password)
    ]);
    if(teacherResponseLogin.status === 200) {
        res.status(200).send(teacherResponseLogin.body);
        return;
    }
    
    if(studentResponseLogin.status === 200) {
        res.status(200).send(studentResponseLogin.body);
        return;
    }

    if(adminResponseLogin.status === 200) {
        res.status(200).send(adminResponseLogin.body);
        return;
    }

    if (studentResponseLogin.status !== 404) {
        res.status(studentResponseLogin.status).send(studentResponseLogin.error);
        return;
    }

    res.status(studentResponseLogin.status).send("couldn't find a user with those credetials")

}

module.exports = {
    loginUser,
}