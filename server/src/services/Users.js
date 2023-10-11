const {User} = require('../models/Users')
const USERS_SERVICE_DEBUG = false

async function registerUser(username, password, displayName) {
    const newUser = new User({
        username: username,
        password: password,
        displayName:displayName
    })

    try {
        await newUser.save();
        if(USERS_SERVICE_DEBUG){
            console.log('User saved successfully:', newUser);
        }
        return {
            status:200,
            body:{
                username:username,
                displayName:displayName
            }
        };

    }
    catch (error){
        console.log(error);
        if (error.name === "ValidationError"){
            return {
                status: 400,
                error: error.message
            }
        }
        return {
            error,
            status:500
        }
    }

}

module.exports= {
    registerUser,
}