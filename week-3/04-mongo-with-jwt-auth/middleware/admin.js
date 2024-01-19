const jwt = require("jsonwebtoken")
// Middleware for handling auth
const {JWT_SECRET} = require("../config")
function adminMiddleware(req, res, next) {
    // Implement admin auth logic
    // You need to check the headers and validate the admin from the admin DB. Check readme for the exact headers to be expected
    const auth = req.headers.authorization
    if(!auth){
        res.status(401).json({
            "msg": "invalid authorization"
        })
    }else{
    const token = auth.split(' ')[1]
        const verified = jwt.verify(token, JWT_SECRET)
        if(verified.username){
            next()
        }else{
            res.status(403).json({
                msg: "you are not authenticated"
            })
        }
    }
}

module.exports = adminMiddleware;