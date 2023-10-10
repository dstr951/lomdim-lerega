const TeachersService  = require("../services/Teachers");

async function registerTeacher(req,res){
    const {email, password, name, dateOfBirth, socialProfileLink, phoneNumber, profilePicture} = req.body
    const registerTeacherResponse = await TeachersService.registerTeacher(
        email, password, name, dateOfBirth, socialProfileLink, phoneNumber, profilePicture)
    if(registerTeacherResponse.status == 200) {
        res.status(200).send(registerTeacherResponse.body)
    } else {
        res.status(registerTeacherResponse.status).send(registerTeacherResponse.error)
    }    
}

module.exports = {
    registerTeacher,
}