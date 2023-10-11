const { Teacher } = require("../models/Teachers");
const TeachersService = require("../services/Teachers");
const bcrypt = require("bcrypt");
const SALT_ROUNDS = 10;

async function registerTeacher(req, res) {
  const {
    email,
    password,
    firstName,
    lastName,
    age,
    socialProfileLink,
    phoneNumber,
    profilePicture,
    aboutMe,
    canTeach,
  } = req.body;
  bcrypt.hash(password, SALT_ROUNDS, async function (err, hashedPassword) {
    const registerTeacherResponse = await TeachersService.registerTeacher(
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
    );
    if (registerTeacherResponse.status == 200) {
      res.status(200).send(registerTeacherResponse.body);
    } else {
      res
        .status(registerTeacherResponse.status)
        .send(registerTeacherResponse.error);
    }
  });
}

async function getAllTeachers() {
  try {
    const teachers = await Teacher.find({});
    if (!teachers) {
      return { status: 404, error: "No teachers found" };
    }
    return { status: 200, body: teachers };
  } catch (err) {
    console.log("Error: ", err);
    return { status: 500, body: err };
  }
}

module.exports = {
  registerTeacher,
  getAllTeachers,
};
