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

async function searchTeachers(req, res) {
  const { email, subject, grade } = req.query;
  if (email) {
    const teacherResponse = await TeachersService.getTecherByEmail(email);
    if (teacherResponse.status == 200) {
      res.status(200).send(teacherResponse.body);
    } else {
      res.status(teacherResponse.status).send(teacherResponse.error);
    }
  } else if (subject || grade) {
    const teacherResponse = await TeachersService.getTechersBySubjectAndGrade(
      subject,
      grade
    );
    if (teacherResponse.status == 200) {
      res.status(200).send(teacherResponse.body);
    } else {
      res.status(teacherResponse.status).send(teacherResponse.error);
    }
  } else {
    res.status(400).send("bad request");
  }
}
async function getAllTeachers(req, res) {
  const teacherResponse = await TeachersService.getAllTeachers();
  if (teacherResponse.status == 200) {
    res.status(200).send(teacherResponse.body);
  } else {
    res.status(teacherResponse.status).send(teacherResponse.error);
  }
}

async function searchTeachers(req, res){
    const {email, subject, grade} = req.query
    if(email) {
        const teacherResponse = await TeachersService.getTecherByEmail(email)
        if(teacherResponse.status == 200) {
            res.status(200).send(teacherResponse.body)
        } else {
            res.status(teacherResponse.status).send(teacherResponse.error)
        }
    } else if(subject && grade) {
        const teacherResponse = await TeachersService.getTechersBySubjectAndGrade(subject, grade)
        if(teacherResponse.status == 200) {
            res.status(200).send(teacherResponse.body)
        } else {
            res.status(teacherResponse.status).send(teacherResponse.error)
        }
    } else {
        res.status(400).send("bad request")
    }
}

module.exports = {
  registerTeacher,
  searchTeachers,
  getAllTeachers,
};
