const { Student } = require("../models/Students");
const { User } = require("../models/Users");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { creationServiceErrorHandler } = require("../commonFunctions");
const {Teacher} = require("../models/Teachers");

const STUDENTS_SERVICE_DEBUG = false;

async function registerStudent(email, hashedPassword, parent, student) {
  const db = await mongoose
    .createConnection(process.env.MONGODB_URI)
    .asPromise();
  try {
    const registerStudentResponse = await db
      .startSession()
      .then((_session) => {
        session = _session;
        session.startTransaction();
      })
      .then(() => {
        const newUser = new User({
          email,
          password: hashedPassword,
          role: "student",
        });
        return newUser
          .save({ session })
          .then(() => {
            if (STUDENTS_SERVICE_DEBUG) {
              console.log("in then clause of creating user");
            }
            const newStudent = new Student({
              email,
              student,
              parent,
            });
            return newStudent.save({ session }).then(async () => {
              //use await to return values and not promises
              await session.commitTransaction();
              if (STUDENTS_SERVICE_DEBUG) {
                console.log("in then clause of creating student");
              }
              return {
                status: 200,
                body: {
                  email,
                },
              };
            });
          })
          .catch(async (err) => {
            if (STUDENTS_SERVICE_DEBUG) {
              console.log("I catched an error of creating user or student");
            }
            //use await to return values and not promises
            await session.abortTransaction();
            await session.endSession();
            return creationServiceErrorHandler(err);
          });
      });

    if (STUDENTS_SERVICE_DEBUG) {
      console.log("finished transaction", registerStudentResponse);
    }
    return registerStudentResponse;
  } catch (error) {
    if (STUDENTS_SERVICE_DEBUG) {
      console.log("in catch clause");
      console.log(error);
    }
    return creationServiceErrorHandler(error);
  }
}

async function loginStudent(email, password) {
  try {
    const student = await Student.findOne({ email });
    if (!student) {
      return {
        status: 404,
        error: "We couldn't find a student with those credentials",
      };
    }
    const compareResult = await bcrypt.compare(password, student.password);
    if (!compareResult) {
      return {
        status: 404,
        error: "We couldn't find a student with those credentials",
      };
    }
    const data = { email, isAdmin: false };
    // Generate the token.
    const token = jwt.sign(data, process.env.JWT_KEY);
    // Return the token to the browser
    return {
      status: 200,
      body: token,
    };
  } catch (error) {
    console.log(error);
    return {
      status: 500,
      body: error,
    };
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

async function updateAuthenticationStudentByEmail(email, newAuthentication) {
  try {
    const filter = { email: email, role: "student" };
    const update = { authenticated: newAuthentication };
    const response = await User.findOneAndUpdate(filter, update);
    if (!response) {
      return {
        status: 404,
        error: "Student could not update",
      };
    }
    return {
      status: 200,
      body: response,
    };
  } catch (error) {
    console.log("error: ", error);
    return {
      status: 500,
      error,
    };
  }
}

async function getAllStudentsAdmin() {
  try {
    const students = await Student.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "email",
          foreignField: "email",
          as: "userFields",
        },
      },
    ]);
    const formattedStudents = students.map((student) => {
      return {
        email: student.email,
        firstName: student.firstName,
        lastName: student.lastName,
        age: student.age,
        parent: student.parent,
        student: student.student,
        authenticated: student.userFields[0].authenticated,
        role:"student"
      };
    });
    if (!formattedStudents) {
      return { status: 404, error: "No teachers found" };
    }
    return { status: 200, body: formattedStudents };
  } catch (error) {
    console.log(error);
    return { status: 500, body: error };
  }
}



module.exports = {
  registerStudent,
  getStudentByEmail,
  updateAuthenticationStudentByEmail,
  getAllStudentsAdmin
};
