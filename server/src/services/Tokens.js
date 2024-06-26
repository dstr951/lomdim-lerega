const jwt = require("jsonwebtoken");

function isLoggedIn(req, res, next) {
  if (!req.headers.authorization) {
    return res.status(401).end();
  }
  const token = req.headers.authorization;
  try {
    // Verify the token is valid
    const data = jwt.verify(token, process.env.JWT_KEY);
    return next();
  } catch (err) {
    console.log(err);
    return res.status(401).send("Invalid Token");
  }
}

function isAdmin(req, res, next) {
  if (!req.headers.authorization) {
    return res.status(401).end();
  }
  const token = req.headers.authorization;
  try {
    // Verify the token is valid
    const data = jwt.verify(token, process.env.JWT_KEY);
    if (data.role === "admin") {
      return next();
    } else {
      return res.status(403).send("Not an admin");
    }
  } catch (err) {
    console.log(err);
    return res.status(401).send("Invalid Token");
  }
}
function isStudent(req, res, next) {
  if (!req.headers.authorization) {
    return res.status(401).send("No authorization header");
  }
  const token = req.headers.authorization;
  try {
    // Verify the token is valid
    const data = jwt.verify(token, process.env.JWT_KEY);
    if (data.role === "student") {
      return next();
    } else {
      return res.status(403).send("Not a student");
    }
  } catch (err) {
    console.log(err);
    return res.status(401).send("Invalid Token");
  }
}
function isTeacher(req, res, next) {
  if (!req.headers.authorization) {
    return res.status(401).send("No authorization header");
  }
  const token = req.headers.authorization;
  try {
    // Verify the token is valid
    const data = jwt.verify(token, process.env.JWT_KEY);
    if (data.role === "teacher") {
      return next();
    } else {
      return res.status(403).send("Not a teacher");
    }
  } catch (err) {
    console.log(err);
    return res.status(401).send("Invalid Token");
  }
}
function isAuthenticated(req, res, next) {
  if (!req.headers.authorization) {
    return res.status(401).send("No authorization header");
  }
  const token = req.headers.authorization;
  try {
    // Verify the token is valid
    const data = jwt.verify(token, process.env.JWT_KEY);
    if (data.authenticated === true) {
      return next();
    } else {
      return res.status(403).send("Not authenticated");
    }
  } catch (err) {
    console.log(err);
    return res.status(401).send("Invalid Token");
  }
}

module.exports = {
  isLoggedIn,
  isAuthenticated,
  isAdmin,
  isStudent,
  isTeacher,
};
