const UserService = require("../services/Users");
const {deleteExpiredPasswordResets} = require("../models/PasswordReset");
const {notifyResetLink} = require("../services/EmailingResend");
const LoggerService = require("../services/Logger");

async function loginUser(req, res) {
  const { email, password } = req.body;
  //todo: refactor the db to user table with role based on the role choose the correct service
  const userLoginResponse = await UserService.loginUser(email, password);
  if (userLoginResponse.status === 200) {
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

async function resetPasswordLink(req, res){
  const {email} = req.body;
  const userPasswordResetLinkResponse = await UserService.resetPasswordLink(email);
  if(userPasswordResetLinkResponse.status === 200){
    notifyResetLink(email,userPasswordResetLinkResponse.body.link);
    res.status(200).send();
  }
  // got invalid email or some error saving to DB
  else if(userPasswordResetLinkResponse.status === 400){
    LoggerService.log("no link was made but server response should appear as if email was valid");
    LoggerService.log("error details-" + userPasswordResetLinkResponse.body);
    res.status(200).send();
  }

  //some error
  else{
    LoggerService.log("some error-" + userPasswordResetLinkResponse.body);
    res.status(500).send();
  }

}

async function restPassword(req, res){
  const {email, password} = req.body;
  const url = req.url;
  const token = getTokenFromUrl(url);
  const userPasswordResetResponse = await UserService.resetPassword(email,password, token);
  res.status(userPasswordResetResponse.status).send();
  }

async function validLink(req,res){
  const url = req.url;
  const token = getTokenFromUrl(url);
  if(await UserService.validateLink(token)){
    res.status(200).send() ;
  }
  else{
    res.status(404).send() ;
  }
}

function getTokenFromUrl(url){
  // Split the URL by "/"
  const parts = url.split('/');

// Check if there are at least three parts (including the empty string at the beginning)
  if (parts.length !== 3) {
    LoggerService.log("URL format is not as expected.");
    return null;

  } else {
    // Get the third part (index 2) and assign it to a variable
    return parts[2];

  }
}
module.exports = {
  loginUser,
  resetPasswordLink,
  restPassword,
  validLink
};
