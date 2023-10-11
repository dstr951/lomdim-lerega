const jwt = require("jsonwebtoken")

function isLoggedIn(req, res, next) {
        if (!req.headers.authorization) {
            return res.status(401).end();
        }
        const token = req.headers.authorization;
        try {
        // Verify the token is valid
            const data = jwt.verify(token, key);
            return next()    
        } catch (err) {
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
        const data = jwt.verify(token, key);
        if(data.admin){
            return next()
        } else {
            return res.status(403).send("Not an admin");
        }            
    } catch (err) {
        return res.status(401).send("Invalid Token");
    }           
}

module.exports = {
    isLoggedIn
}