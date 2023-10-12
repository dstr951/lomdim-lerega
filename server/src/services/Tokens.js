const jwt = require("jsonwebtoken")

function isLoggedIn(req, res, next) {
        if (!req.headers.authorization) {
            return res.status(401).end();
        }
        const token = req.headers.authorization;
        try {
        // Verify the token is valid
            const data = jwt.verify(token, process.env.JWT_KEY);
            return next()    
        } catch (err) {
            console.log(err)
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
        if(data.role === "admin"){
            return next()
        } else {
            return res.status(403).send("Not an admin");
        }            
    } catch (err) {
        console.log(err)
        return res.status(401).send("Invalid Token");
    }           
}

module.exports = {
    isLoggedIn,
    isAdmin,
}