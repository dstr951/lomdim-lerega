function validatePhoneNumber(phoneNumber){
    return phoneNumber.match(/^[0-9]+$/) !== null;
}
function validatePassword(password){
    // Check if the password length is greater than 7
    
    return password.match(/^[A-Za-z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,}$/i) !== null;
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