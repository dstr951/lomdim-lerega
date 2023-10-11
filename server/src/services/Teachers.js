const { Teacher } = require("../models/Teachers");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const TEACHERS_SERVICE_DEBUG = false;

async function registerTeacher(
  email,
  hashedPassword,
  firstName,
  lastName,
  age,
  socialProfileLink,
  phoneNumber,
  profilePicture,
  aboutMe,
  canTeach
) {
  const newTeacher = new Teacher({
    email,
    password: hashedPassword,
    firstName,
    lastName,
    age,
    socialProfileLink,
    phoneNumber,
    profilePicture,
    aboutMe,
    canTeach,
  });

  try {
    await newTeacher.save();
    if (TEACHERS_SERVICE_DEBUG) {
      console.log("Teacher saved successfully:", newTeacher);
    }
    return {
      status: 200,
      body: {
        email,
      },
    };
  } catch (error) {
    console.log(error);
    if (error.name === "ValidationError") {
      return {
        status: 400,
        error: error.message,
      };
    }
    return {
      error,
      status: 500,
    };
  }
}

async function loginTeacher(email, password) {
  try {
    const teacher = await Teacher.findOne({ email });
    if (!teacher) {
      return {
        status: 404,
        error: "We couldn't find a teacher with those credentials",
      };
    }
    const compareResult = await bcrypt.compare(password, teacher.password);
    if (!compareResult) {
      return {
        status: 404,
        error: "We couldn't find a teacher with those credentials",
      };
    }
    const data = { email };
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

async function getAllTeachers() {
  try {
    const teachers = await Teacher.find({});
    if (!teachers) {
      return { status: 404, error: "No teachers found" };
    }
    return { status: 200, body: teachers };
  } catch (error) {
    console.log(error);
    return { status: 500, body: error };
  }
}

async function getTeacherByEmail(email) {
  try {
    const teacher = await Teacher.findOne({ email });
    if (!teacher) {
      return {
        status: 404,
        error: "We couldn't find a teacher with this email",
      };
    }
    return {
      status: 200,
      body: teacher,
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
  registerTeacher,
  loginTeacher,
  getAllTeachers,
  getTeacherByEmail,
};
