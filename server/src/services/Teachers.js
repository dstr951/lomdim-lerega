const { Teacher } = require("../models/Teachers");
const { User } = require("../models/Users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { registrationServiceErrorHandler } = require('../commonFunctions');
const { lookup } = require("dns");


const TEACHERS_SERVICE_DEBUG = false;

async function registerTeacher(
  email,
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
    return registrationServiceErrorHandler(error);
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
    const data = { email, isAdmin:false};
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

const TEACHERS_LIMIT = 50;
async function getTeachersBySubjectAndGrade(subject, grade) {
  try {
    const matcher = {};
    if (subject && subject > 0) {
      matcher.subject = subject;
    }
    if (grade && grade > 0) {
      matcher.lowerGrade = { $lte: grade };
      matcher.higherGrade = { $gte: grade };
    }
    const teachers = await Teacher.find({
      canTeach: { $elemMatch: matcher },
    }).limit(TEACHERS_LIMIT);
    if (!teachers) {
      return {
        status: 404,
        error: "We couldn't find a teachers with those conditions",
      };
    }
    return {
      status: 200,
      body: teachers,
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

async function getAllTeachersAdmin() {
  try {
    const teachers = await Teacher.aggregate([{"$lookup": {
      from: "users",
      localField: 'email',
      foreignField: 'email',
      as: 'userFields',  
    }}]);
    const formattedTeachers = teachers.map(teacher => {
      return {
        "email": teacher.email,
        "firstName": teacher.firstName,
        "lastName": teacher.lastName,
        "age": teacher.age,
        "socialProfileLink": teacher.socialProfileLink,
        "phoneNumber": teacher.phoneNumber,
        "profilePicture": teacher.profilePicture,
        "aboutMe": teacher.aboutMe,
        "canTeach": teacher.canTeach,
        "authenticated": teacher.userFields[0].authenticated
      }
    })
    if (!formattedTeachers) {
      return { status: 404, error: "No teachers found" };
    }
    return { status: 200, body: formattedTeachers };
  } catch (error) {
    console.log(error);
    return { status: 500, body: error };
  }
}

async function updateAuthenticationTeacherByEmail(email, newAuthentication){
    try {
        const filter = { email: email, role:"teacher" };
        const update = { authenticated: newAuthentication };
        const response = await User.findOneAndUpdate(filter, update);
        if (!response) {
          return {
            status:404,
            error:"Teacher could not update"
          }
        }
        return {
            status: 200,
            body: response
        }
      } catch (error) {
        console.log("error: ", error);
        return {
            status: 500,
            error
        }
      }
}

module.exports = {
  getTeacherByEmail,
  getTeachersBySubjectAndGrade,
  registerTeacher,
  getAllTeachers,
  updateAuthenticationTeacherByEmail,
  getAllTeachersAdmin,
};
