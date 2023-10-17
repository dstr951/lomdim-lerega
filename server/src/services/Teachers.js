const { Teacher } = require("../models/Teachers");
const { User } = require("../models/Users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { creationServiceErrorHandler } = require("../commonFunctions");
const LoggerService = require("./Logger");

const lookupUsersOnEmailExpression = {
  $lookup: {
    from: "users",
    localField: "email",
    foreignField: "email",
    as: "userFields",
  },
};
const matchTeachersOnAuthentication = {
  $match: { userFields: { $elemMatch: { authenticated: true } } },
};

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
  const db = await mongoose
    .createConnection(process.env.MONGODB_URI)
    .asPromise();
  try {
    const registerTeacherResponse = await db
      .startSession()
      .then((_session) => {
        session = _session;
        session.startTransaction();
      })
      .then(() => {
        const newUser = new User({
          email,
          password: hashedPassword,
          role: "teacher",
        });
        return newUser
          .save({ session })
          .then(() => {
            if (TEACHERS_SERVICE_DEBUG) {
              console.log("in then clause of creating user");
            }
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
            return newTeacher.save({ session }).then(async () => {
              //use await to return values and not promises
              await session.commitTransaction();
              if (TEACHERS_SERVICE_DEBUG) {
                console.log("in then clause of creating teacher");
              }
              LoggerService.log(`User ${email} registered successfully`);
              return {
                status: 200,
                body: {
                  email,
                },
              };
            });
          })
          .catch(async (err) => {
            //use await to return values and not promises
            if (TEACHERS_SERVICE_DEBUG) {
              console.log("I caught the error of creating a user or a teacher");
            }
            await session.abortTransaction();
            await session.endSession();
            LoggerService.error(`Error creating teacher ${email}: ${err}`);
            return creationServiceErrorHandler(err);
          });
      });

    if (TEACHERS_SERVICE_DEBUG) {
      console.log("finished transaction", registerTeacherResponse);
    }
    return registerTeacherResponse;
  } catch (error) {
    if (TEACHERS_SERVICE_DEBUG) {
      console.log("in catch clause");
      console.log(error);
    }
    LoggerService.error(`Error creating teacher ${email}: ${error}`);
    return creationServiceErrorHandler(error);
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

async function getTeacherByEmail(email, authorized, sensitive) {
  try {
    const teacher = await Teacher.findOne({ email });
    if (!teacher) {
      LoggerService.error(`Couldn't find a teacher with username ${email}`);
      return {
        status: 404,
        error: "We couldn't find a teacher with this email",
      };
    }
    const formattedTeachers = createTeacherObject(
      teacher,
      authorized,
      sensitive
    );
    LoggerService.log(`Successfully accessed ${email}'s teacher page`);
    return {
      status: 200,
      body: formattedTeachers,
    };
  } catch (error) {
    LoggerService.error(
      `Couldn't access ${email}'s teacher page, error: ${error}`
    );
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
    subject = parseInt(subject);
    grade = parseInt(grade);
    if (subject && subject > 0) {
      matcher.subject = subject;
    }
    if (grade && grade > 0) {
      matcher.lowerGrade = { $lte: grade };
      matcher.higherGrade = { $gte: grade };
    }
    const teachers = await Teacher.aggregate([
      lookupUsersOnEmailExpression,
      matchTeachersOnAuthentication,
      { $match: { canTeach: { $elemMatch: matcher } } },
    ]).limit(TEACHERS_LIMIT);
    const formattedTeachers = createTeacherObjectFromArray(
      teachers,
      true,
      false
    );
    if (!formattedTeachers) {
      LoggerService.log(
        `Could not find teachers with paramteres: ${subject} , ${grade}`
      );
      return {
        status: 404,
        error: "We couldn't find a teachers with those conditions",
      };
    }
    LoggerService.log(`Found teacher/s with paramteres: ${subject} , ${grade}`);
    return {
      status: 200,
      body: formattedTeachers,
    };
  } catch (error) {
    LoggerService.error(
      `Error searching for teachers with parameters: $${subject} , ${grade}: ${error}`
    );
    console.log(error);
    return {
      status: 500,
      error: error,
    };
  }
}

async function getAllTeachers() {
  try {
    const authenticatedTeachers = await Teacher.aggregate([
      lookupUsersOnEmailExpression,
      matchTeachersOnAuthentication,
    ]);
    const teachers = createTeacherObjectFromArray(
      authenticatedTeachers,
      true,
      false
    );
    if (!teachers) {
      return { status: 404, error: "No teachers found" };
    }
    return { status: 200, body: teachers };
  } catch (error) {
    console.log(error);
    return { status: 500, error: error };
  }
}

async function getAllTeachersAdmin() {
  try {
    const teachers = await Teacher.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "email",
          foreignField: "email",
          as: "userFields",
        },
      },
    ]);
    const formattedTeachers = teachers.map((teacher) => {
      return {
        email: teacher.email,
        firstName: teacher.firstName,
        lastName: teacher.lastName,
        age: teacher.age,
        socialProfileLink: teacher.socialProfileLink,
        phoneNumber: teacher.phoneNumber,
        profilePicture: teacher.profilePicture,
        aboutMe: teacher.aboutMe,
        canTeach: teacher.canTeach,
        authenticated: teacher.userFields[0].authenticated,
        role:"teacher"
      };
    });
    if (!formattedTeachers) {
      return { status: 404, error: "No teachers found" };
    }
    return { status: 200, body: formattedTeachers };
  } catch (error) {
    console.log(error);
    return { status: 500, body: error };
  }
}

async function updateAuthenticationTeacherByEmail(email, newAuthentication) {
  try {
    const filter = { email: email, role: "teacher" };
    const update = { authenticated: newAuthentication };
    const response = await User.findOneAndUpdate(filter, update);
    if (!response) {
      LoggerService.error(
        `admin tried to update status of ${email} to ${newAuthentication} but couldn't find the teacher`
      );
      return {
        status: 404,
        error: "Teacher could not update",
      };
    }
    LoggerService.log(
      `admin successfully change status of teacher ${email} to ${newAuthentication}`
    );
    return {
      status: 200,
      body: response,
    };
  } catch (error) {
    LoggerService.error(
      `admin failed to change status of teacher ${email} to ${newAuthentication}`
    );
    return {
      status: 500,
      error,
    };
  }
}

function createTeacherObjectFromArray(
  teachers,
  sendAuthenticated,
  sendSensitive
) {
  return teachers.map((teacher) =>
    createTeacherObject(teacher, sendAuthenticated, sendSensitive)
  );
}
function createTeacherObject(teacher, sendAuthenticated, sendSensitive) {
  const newTeacher = {
    firstName: teacher.firstName,
    lastName: teacher.lastName,
    age: teacher.age,
    email: teacher.email,
    socialProfileLink: teacher.socialProfileLink,
    profilePicture: teacher.profilePicture,
    aboutMe: teacher.aboutMe,
    canTeach: teacher.canTeach,
  };
  if (sendAuthenticated) {
    newTeacher.authenticated = teacher.userFields[0].authenticated;
  }
  if (sendSensitive) {
    newTeacher.phoneNumber = teacher.phoneNumber;
  }
  return newTeacher;
}

module.exports = {
  getTeacherByEmail,
  getTeachersBySubjectAndGrade,
  registerTeacher,
  getAllTeachers,
  updateAuthenticationTeacherByEmail,
  getAllTeachersAdmin,
};
