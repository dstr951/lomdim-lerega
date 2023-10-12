const StudentsService = require("../services/Students");
const UsersService = require("../services/Users");
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;

async function registerStudent(req, res) {
    const { email, password, parent, student } = req.body;

    bcrypt.hash(password, SALT_ROUNDS, async function (err, hashedPassword) {
        if(err) {
            return res.status(500).send("Error hashing the password.");
        }
        const userRegisterResponse = await UsersService.registerUser(email, hashedPassword, "student")
        if(userRegisterResponse.status !== 200) {
        res
            .status(userRegisterResponse.status)
            .send(userRegisterResponse.error);
            return;
        }

        const studentRegisterResponse = await StudentsService.registerStudent(
            email, parent, student
        );

        if (studentRegisterResponse.status == 200) {
            res.status(200).send(studentRegisterResponse.body);
        } else {
            res.status(studentRegisterResponse.status).send(studentRegisterResponse.error);
        }
    });
}

module.exports = {
    registerStudent,
    // ... other methods you may have in this controller
};