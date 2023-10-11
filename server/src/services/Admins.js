const { Admin } = require("../models/Admins");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function loginAdmin(email, password) {
    try {
      const admin = await Admin.findOne({ email });
      if (!admin) {
        return {
          status: 404,
          error: "We couldn't find a admin with those credentials",
        };
      }
      const compareResult = await bcrypt.compare(password, admin.password);
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