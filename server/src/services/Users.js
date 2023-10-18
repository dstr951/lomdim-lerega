const { User } = require("../models/Users");
const { creationServiceErrorHandler } = require("../commonFunctions");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const LoggerService = require("./Logger");
const SALT_ROUNDS = 10;
const USERS_SERVICE_DEBUG = false;

async function registerUser(email, hashedPassword, role) {
  const newUser = new User({
    email,
    password: hashedPassword,
    role,
  });
  try {
    await newUser.save();
    if (USERS_SERVICE_DEBUG) {
      console.log("Student saved successfully:", newUser);
    }
    LoggerService.log(`User created successfully: ${email}, ${role}`);
    return {
      status: 200,
      body: {
        email,
      },
    };
  } catch (error) {
    LoggerService.log(`user registration failed: ${email}, ${role}, ${error}`);
    return creationServiceErrorHandler(error);
  }
}
async function loginUser(email, password) {
  const hashedPassword = bcrypt.hashSync(password, SALT_ROUNDS);
  try {
    const user = await User.findOne({ email });
    if (!user) {
      LoggerService.error(`No account with email '${email}' as a username`);
      return {
        status: 404,
        error: "We couldn't find a user with those credentials",
      };
    }
    const compareResult = await bcrypt.compare(password, user.password);
    if (!compareResult) {
      LoggerService.error(
        `Username: ${email} did not match the passsword ${hashedPassword}`
      );
      return {
        status: 404,
        error: "We couldn't find a user with those credentials",
      };
    }
    const data = { email, role: user.role, authenticated: user.authenticated };
    const token = jwt.sign(data, process.env.JWT_KEY);
    LoggerService.log(
      `User:${email} logged in successfully as a ${user.role}.`
    );
    return {
      status: 200,
      body: {
        token,
        authenticated: user.authenticated,
      },
    };
  } catch (error) {
    LoggerService.error(`Error loggin in to student ${email}: ${error}`);
    return {
      status: 500,
      body: error,
    };
  }
}

module.exports = {
  registerUser,
  loginUser,
};
