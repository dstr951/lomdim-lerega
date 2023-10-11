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

async function getAllTeachers(req, res) {
  const teacherResponse = await TeachersService.getAllTeachers();
  if (teacherResponse.status == 200) {
    res.status(200).send(teacherResponse.body);
  } else {
    res.status(teacherResponse.status).send(teacherResponse.error);
  }
}

async function approveTeacher(req, res) {
  const email = req.params.email;
  try {
    const filter = { email: email };
    const update = { authenticated: true };
    const response = await Teacher.findOneAndUpdate(filter, update);
    if (!response) {
      return res.status(404).send("Teacher could not update");
    }
    return res.json(response);
  } catch (error) {
    console.log("error: ", error);
    return res.status(500).send("Internal Server Error");
  }
}

async function rejectTeacher(req, res) {
  const email = req.params.email;
  try {
    const filter = { email: email };
    const update = { authenticated: false };
    const response = await Teacher.findOneAndUpdate(filter, update);
    if (!response) {
      return res.status(404).send("Teacher could not update");
    }
    return res.json(response);
  } catch (error) {
    console.log("error: ", error);
    return res.status(500).send("Internal Server Error");
  }
}

module.exports = {
  registerTeacher,
  getAllTeachers,
  approveTeacher,
  rejectTeacher,
};
