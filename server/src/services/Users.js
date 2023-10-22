const { User } = require("../models/Users");
const {PasswordReset, deleteExpiredPasswordResets} = require("../models/PasswordReset")
const { creationServiceErrorHandler, validatePassword} = require("../commonFunctions");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const LoggerService = require("./Logger");
const crypto = require("crypto");
const StudentsService = require("./Students");
const SALT_ROUNDS = 10;
const USERS_SERVICE_DEBUG = false;
const LINK = "lomdim-lerega.com/resetPassword/"

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

async function resetPasswordLink(email) {
  try {
    // Check if a password reset link is already generated
    const existingReset = await PasswordReset.findOne({email: email});

    if (existingReset && existingReset.expirationDate.getTime() > Date.now()) {
      const token = existingReset.token;
      return {
        status: 200,
        body: {link: LINK + token}
      };
    }

    else {
      // No link generated yet, generate a random token
      const randomToken = crypto.randomBytes(32).toString('hex');

      // Calculate the expiration date by adding 10 minutes to the current date
      const expirationDate = new Date();
      expirationDate.setMinutes(expirationDate.getMinutes() + 10);
      // update link
      if(existingReset){
        // update email to reset password for
        try{
          await PasswordReset.updateOne({email : email},{$set: {
            expirationDate: expirationDate,
            token: randomToken
          }
          })
          return {
            status: 200,
            body: {link: LINK + randomToken}
          };
        } catch (e) {
          return {
            status: 400, // You may use 400 for client errors if there's an issue with saving
            body: e.message // Include the error message in the response
          };
        }


      }
      else {
        // Create and save a new PasswordReset document
        const newPasswordReset = new PasswordReset({
          email: email,
          expirationDate: expirationDate,
          token: randomToken
        });

        try {
          await newPasswordReset.save();
          //saved successfully
          return {
            status: 200,
            body: {link: LINK + randomToken}
          };
          //error saving to DB
        } catch (e) {
          return {
            status: 400, // You may use 400 for client errors if there's an issue with saving
            body: e.message // Include the error message in the response
          };
        }
      }
    }
  }catch (e) {
    return {
      status: 500,
      body: e.message // Include the error message in the response
    };
  }
}

/* steps-
      1. check valid token
      2. check valid time
      3. if valid- update password
      4. return response
   */
async function resetPassword(email, newPassword, token) {
  try {
    const resetUserPassword = await PasswordReset.findOne({ email: email });
    if (resetUserPassword) {
      // Check if the token matches and the expiration time is valid
      if (
          resetUserPassword.token === token &&
          resetUserPassword.expirationDate.getTime() > Date.now()
      ) {
        try {
          if (!validatePassword(newPassword)){
            console.log("new password not valid");
            return {status: 401};
          }
          // Hash the password
          const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);

          // Update the user's password
          await User.updateOne({ email: email }, {
            $set: {
              password: hashedPassword
            }
          },{runValidators : true});

          console.log("Updated password successfully");
          //destroy reset link
          PasswordReset.deleteOne({ email: email })
              .then(() => {
                console.log("Delete link successfully");
              })
              .catch((error) => {
                console.log("Error deleting link:", error);
              });
          return { status: 200 };
        } catch (e) {
          console.log("Error updating password: " + e.message);
          return { status: 500 };
        }
      } else {
        if (resetUserPassword.token !== token) {
          console.log("Email doesn't match token from URL");
        } else {
          console.log("Link expired");
          //delete expired links
          deleteExpiredPasswordResets();
        }
        return { status: 401 };
      }
    } else {
      console.log("No link was generated for this email");
      return { status: 400 };
    }
  } catch (e) {
    console.log("Internal error: " + e.message);
    return { status: 500 };
  }
}



module.exports = {
  registerUser,
  loginUser,
  resetPasswordLink,
  resetPassword
};
