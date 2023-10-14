const StudentsService = require("../services/Students");
const UsersService = require("../services/Users");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const SALT_ROUNDS = 10;

async function registerStudent(req, res) {
  const { email, password, parent, student } = req.body;

  bcrypt.hash(password, SALT_ROUNDS, async function (err, hashedPassword) {
    if (err) {
      return res.status(500).send("Error hashing the password.");
    }
    const studentRegisterResponse = await StudentsService.registerStudent(
      email,
      hashedPassword,
      parent,
      student
    );

    if (studentRegisterResponse.status == 200) {
      res.status(200).send(studentRegisterResponse.body);
    } else {
      res
        .status(studentRegisterResponse.status)
        .send(studentRegisterResponse.error);
    }
  });
}
async function getMyselfStudent(req, res) {
  const token = req.headers.authorization;
  let email;
  try {
    // Verify the token is valid
    const data = jwt.verify(token, process.env.JWT_KEY);
    email = data.email;
  } catch (err) {
    console.log(err);
    return res.status(401).send("Invalid Token");
  }
  if (!email) {
    console.log("token didn't contain an email");
    res.status(401).send("Invalid Token");
    return;
  }
  const studentResponse = await StudentsService.getStudentByEmail(email);
  if (studentResponse.status == 200) {
    res.status(200).send(studentResponse.body);
  } else {
    res.status(studentResponse.status).send(studentResponse.error);
  }
}

module.exports = {
  getMyselfStudent,
  registerStudent,
};
