const { Teacher } = require("../models/Teachers");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function loginAdmin(email, password) {
    try {
      const teacher = await Teacher.findOne({ email });
      if (!teacher) {
        return {
          status: 404,
          error: "We couldn't find a admin with those credentials",
        };
      }
      const compareResult = await bcrypt.compare(password, teacher.password);
      if (!compareResult) {
        return {
          status: 404,
          error: "We couldn't find a admin with those credentials",
        };
      }
      const data = { email, admin:true };
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