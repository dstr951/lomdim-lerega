const {Student} = require("../models/Students");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken")
const STUDENTS_SERVICE_DEBUG = false

async function registerStudent(email, hashedPassword, parent, student) {
    const newStudent = new Student({
        email,
        password: hashedPassword,
        student,
        parent
    })

    
    try {
        await newStudent.save();
        if(STUDENTS_SERVICE_DEBUG){
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

async function loginStudent(email, password) {
    try {
        const student = await Student.findOne({email})
        if(!student) {
            return {
                status:404,
                error: "We couldn't find a student with those credentials"
            }
        }
        const compareResult = await bcrypt.compare(password, student.password) 
        if(!compareResult) {
            return {
                status:404,
                error: "We couldn't find a student with those credentials"
            }
        }
        const data = {email}
        // Generate the token.
        const token = jwt.sign(data, process.env.JWT_KEY)
        // Return the token to the browser
        return{
            status: 200,
            body: token
        }
       
    } catch (error) {
        console.log(error)
        return {
            status:500,
            body:error
        }

    }
}

module.exports = {
    registerStudent,
    loginStudent
};
