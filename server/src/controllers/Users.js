const UserService  = require("../services/Users");

async function registerUser(req,res){
    const registerUserResponse = await UserService.registerUser(
        req.body.username,
        req.body.password,
        req.body.displayName)
    if(registerUserResponse.status == 200) {
        res.status(200).send(registerUserResponse.body)
    } else {
        res.status(registerUserResponse.status).send(registerUserResponse.error)
    }    
}

module.exports = {
    registerUser,
}