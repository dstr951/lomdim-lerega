const {Student} = require("../models/Students");
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;
const TEACHERS_SERVICE_DEBUG = false

async function registerStudent(email, hashedPassword, parent, student) {
    console.log(student, parent)
    const newStudent = new Student({
        email,
        password: hashedPassword,
        student,
        parent
    })

    
    try {
        await newStudent.save();
        if(TEACHERS_SERVICE_DEBUG){
            console.log('Student saved successfully:', newStudent);
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

module.exports = {
    registerStudent,
};
