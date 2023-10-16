const UserService = require("../services/Users");

async function loginUser(req, res) {
  const { email, password } = req.body;
  //todo: refactor the db to user table with role based on the role choose the correct service
  const userLoginResponse = await UserService.loginUser(email, password);
  if (userLoginResponse.status === 200) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(200).send(userLoginResponse.body);
    return;
  } else if (userLoginResponse.status === 404) {
    res.status(404).send(userLoginResponse.error);
    return;
  } else {
    res.status(userLoginResponse.status).send(userLoginResponse.error);
    return;
  }
}

module.exports = {
  loginUser,
};
