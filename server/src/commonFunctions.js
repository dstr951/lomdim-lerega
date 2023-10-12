function validatePhoneNumber(phoneNumber){
    if(phoneNumber.length !== 10) {
        return false;
    }
    return true;
}
function validatePassword(password){
    // Check if the password length is greater than 7
    if (password.length <= 7) {
        return false;
    }
    return true;
}

function validateCanTeach(canTeachArray){
    if(canTeachArray.length === 0){
        return false
    }
    return true
}

module.exports = {
    validatePassword,
    validatePhoneNumber,
    validateCanTeach,
}