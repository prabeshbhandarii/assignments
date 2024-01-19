const jwt = require("jsonwebtoken")
const {JWT_SECRET} = require("../config")
function userMiddleware(req, res, next) {
    // Implement user auth logic
    // You need to check the headers and validate the user from the user DB. Check readme for the exact headers to be expected
    const auth = req.headers.authorization
    if(!auth){
        res.status(401).json({
            "msg": "invalid authorization"
        })
    }else{
    const token = auth.split(' ')[1]
        try{
            const verified = jwt.verify(token, JWT_SECRET)
            req.username = verified.username
            if(verified.username){
                next()
            }else{
                res.status(403).json({
                    msg: "you are not authenticated"
                })
            }
        }catch(err){
            res.json({
                msg: err.message
            })
        }
    }
}

module.exports = userMiddleware;