const {Teacher} = require('../models/Teachers')
const TEACHERS_SERVICE_DEBUG = false

async function registerTeacher(email, hashedPassword, name, dateOfBirth, socialProfileLink, phoneNumber, profilePicture) {
    const newTeacher = new Teacher({
        email,
        password: hashedPassword,
        name,
        dateOfBirth,
        socialProfileLink,
        phoneNumber,
        profilePicture
    })

    try {
        await newTeacher.save();
        if(TEACHERS_SERVICE_DEBUG){
            console.log('Teacher saved successfully:', newTeacher);
        }
        return {
            status:200,
            body:{
                email
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
    registerTeacher,
}