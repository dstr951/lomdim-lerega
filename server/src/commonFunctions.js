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

function creationServiceErrorHandler(error){
    if (error.name === "ValidationError"){
        return {
            status: 400,
            error: error.message
        }
    }
    if(error.code === 11000){
        console.log("error code is 11000")
        return {
            status: 409,
            error: error.message
        }
    }
    return {
        error,
        status:500
    }
}

module.exports = {
    validatePassword,
    validatePhoneNumber,
    validateCanTeach,
    creationServiceErrorHandler,
}