const { Router } = require("express");
const adminMiddleware = require("../middleware/admin");
const router = Router();
const { Admin, Course } = require("../db");
const {JWT_SECRET} = require("../config");
const jwt = require("jsonwebtoken");

// Admin Routes
router.post('/signup', async (req, res) => {
    // Implement admin signup logic
    const username = req.body.username
    const password = req.body.password
    await Admin.create({
        username,
        password
    })
    res.json({
        msg : "admin created successfully"
    })
});

router.post('/signin', async (req, res) => {
    // Implement admin signup logic
    const username = req.body.username
    const password = req.body.password
    const isValidated = await Admin.find({
        username, password
    })
    if(isValidated.length) {
        const token = jwt.sign({username}, JWT_SECRET)
        res.json({
            token: `${token}`
        })
    }else{
        res.status(401).json({
            msg: "unauthorized"
        })
    }
});

router.post('/courses', adminMiddleware, async (req, res) => {
    // Implement course creation logic
    const {title, description, imageLink, price} = req.body
    const courseCreated = await Course.create({
        title, description, imageLink, price
    })
    if(courseCreated){
        res.json({
            msg: "course created successfully"
        })
    }else{
        res.json({
            msg: "sorry somthing went wrong"
        })
    }
});

router.get('/courses', adminMiddleware, async (req, res) => {
    // Implement fetching all courses logic
    const courses = await Course.find()
    res.json({
        courses: `${courses}`
    })
});

module.exports = router;