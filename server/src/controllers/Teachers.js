const TeachersService = require("../services/Teachers");
const LoggerService = require("../services/Logger");
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
    const teacherRegisterResponse = await TeachersService.registerTeacher(
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
    if (teacherRegisterResponse.status === 200) {
      res.status(200).send(teacherRegisterResponse.body);
    } else {
      res
        .status(teacherRegisterResponse.status)
        .send(teacherRegisterResponse.error);
    }
  });
}

async function searchTeachers(req, res) {
  const { email, subject, grade } = req.query;
  if (email) {
    const authorized = false;
    const sensitive = false;
    const teacherResponse = await TeachersService.getTeacherByEmail(
      email,
      authorized,
      sensitive
    );
    if (teacherResponse.status == 200) {
      res.status(200).send(teacherResponse.body);
    } else {
      res.status(teacherResponse.status).send(teacherResponse.error);
    }
  } else if (subject || grade) {
    const teacherResponse = await TeachersService.getTeachersBySubjectAndGrade(
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

async function getAllTeachersAdmin(req, res) {
  const teacherResponse = await TeachersService.getAllTeachersAdmin();
  if (teacherResponse.status == 200) {
    console.log(teacherResponse.body);
    res.status(200).send(teacherResponse.body);
  } else {
    res.status(teacherResponse.status).send(teacherResponse.error);
  }
}

async function approveTeacher(req, res) {
  const email = req.params.email;
  const approvalResponse =
    await TeachersService.updateAuthenticationTeacherByEmail(email, true);
  if (approvalResponse.status == 200) {
    res.status(200).send(approvalResponse.body);
  } else {
    res.status(approvalResponse.status).send(approvalResponse.error);
  }
}

async function rejectTeacher(req, res) {
  const email = req.params.email;
  const approvalResponse =
    await TeachersService.updateAuthenticationTeacherByEmail(email, false);
  if (approvalResponse.status == 200) {
    res.status(200).send(approvalResponse.body);
  } else {
    res.status(approvalResponse.status).send(approvalResponse.error);
  }
}

async function getPictureOfTeacher(req, res) {
  const email = req.params.email;
  if (!email) {
    LoggerService.error(
      `got a request for a teacher picture without any email`
    );
  }
  const pictureResponse = await TeachersService.getPictureOfTeacher(email);
  if (pictureResponse.status == 200) {
    res.status(200).send(pictureResponse.body);
  } else {
    res.status(pictureResponse.status).send(pictureResponse.error);
  }
}

module.exports = {
  searchTeachers,
  getAllTeachers,
  getAllTeachersAdmin,
  approveTeacher,
  rejectTeacher,
  registerTeacher,
  getPictureOfTeacher,
};
