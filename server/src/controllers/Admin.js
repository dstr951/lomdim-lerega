const AdminsService  = require("../services/Admins");


async function loginAdmin(req, res) {
    const {email, password} = req.body
    const adminResponseLogin = await AdminsService.loginAdmin(email, password)
    if(adminResponseLogin.status === 200) {
        res.status(200).send(adminResponseLogin.body)
    } else {
        res.status(teacherResponseLogin.status).send(teacherResponseLogin.error)
    } 
}

module.exports = {
    loginAdmin,
};