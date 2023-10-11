const StudentsService = require("../services/Students");
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;

async function registerStudent(req, res) {
    const { email, password, parent, student } = req.body;

    bcrypt.hash(password, SALT_ROUNDS, async function (err, hashedPassword) {
        if(err) {
            return res.status(500).send("Error hashing the password.");
        }

        const registerStudentResponse = await StudentsService.registerStudent(
            email, hashedPassword, parent, student
        );

        if (registerStudentResponse.status == 200) {
            res.status(200).send(registerStudentResponse.body);
        } else {
            res.status(registerStudentResponse.status).send(registerStudentResponse.error);
        }
    });
}

module.exports = {
    registerStudent,
    // ... other methods you may have in this controller
};