const {User} = require('../models/Users')
const { creationServiceErrorHandler } = require('../commonFunctions')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SALT_ROUNDS = 10;
const USERS_SERVICE_DEBUG = false

async function registerUser(email, hashedPassword, role) {
    const newUser = new User({
        email,
        password: hashedPassword,
        role
    })
    try {
        await newUser.save();
        if(USERS_SERVICE_DEBUG){
            console.log('Student saved successfully:', newUser);
        }
        return {
            status:200,
            body:{
                email
            }
        };
    }
    catch (error){
        console.log(error);
        return creationServiceErrorHandler(error)
    }
}
async function loginUser(email, password) {
    try {
        const student = await User.findOne({email})
        if(!student) {
            return {
                status:404,
                error: "We couldn't find a user with those credentials"
            }
        }
        const compareResult = await bcrypt.compare(password, student.password) 
        if(!compareResult) {
            return {
                status:404,
                error: "We couldn't find a user with those credentials"
            }
        }
        const data = {email, role: student.role}
        // Generate the token.
        const token = jwt.sign(data, process.env.JWT_KEY)
        // Return the token to the browser
        return{
            status: 200,
            body: {
                token
            }
        }
       
    } catch (error) {
        console.log(error)
        return {
            status:500,
            body:error
        }

    }
}

module.exports= {
    registerUser,
    loginUser,
}