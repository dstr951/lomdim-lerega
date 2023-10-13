const {Student} = require("../models/Students");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken")
const { registrationServiceErrorHandler } = require('../commonFunctions')

const STUDENTS_SERVICE_DEBUG = false

async function registerStudent(email, parent, student) {
    const newStudent = new Student({
        email,
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
        return registrationServiceErrorHandler(error)
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
        const data = {email, isAdmin:false}
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

async function getStudentByEmail(email) {
    try {
      const student = await Student.findOne({ email });
      if (!student) {
        return {
          status: 404,
          error: "We couldn't find a student with this email",
        };
      }
      return {
        status: 200,
        body: student,
      };
    } catch (error) {
      console.log(error);
      return {
        status: 500,
        body: error,
      };
    }
  }

module.exports = {
    registerStudent,
    getStudentByEmail,
};
