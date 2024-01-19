const { Router } = require("express");
const router = Router();
const userMiddleware = require("../middleware/user");
const { User, Course } = require("../db");
const jwt = require("jsonwebtoken");
const {JWT_SECRET} = require("../config");
const { default: mongoose } = require("mongoose");
const { captureRejectionSymbol } = require("supertest/lib/test");

// User Routes
router.post('/signup', async (req, res) => {
    // Implement admin signup logic
    const username = req.body.username
    const password = req.body.password
    await User.create({
        username,
        password
    })
    res.json({
        msg : "user created successfully"
    })
});

router.post('/signin', async (req, res) => {
    // Implement admin signup logic
    const username = req.body.username
    const password = req.body.password
    const isValidated = await User.find({
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

router.get('/courses', async (req, res) => {
    // Implement listing all courses logic
    const courses = await Course.find()
    res.json({
        courses: courses
    })
});

router.post('/courses/:courseId', userMiddleware, async (req, res) => {
    // Implement course purchase logic
    const courseId = req.params.courseId
    const username = req.username
    try{
        await User.updateOne({
            username: username
        },{
            $push: {
                purchasedCourses: courseId
            }
        })
        res.json({
            msg: "course purchased successfully"
        })
    }catch{
        res.json({
            msg: "course could not be purchased"
        })
    }
});

router.get('/purchasedCourses', userMiddleware, async (req, res) => {
    // Implement fetching purchased courses logic
    const username = req.username
    try{
        const userInfo = await User.findOne({username: username})
        const courseInfo = await Course.findOne({_id: userInfo.purchasedCourses})
        res.json({
            courses: courseInfo
        })
    }catch{
        res.json({
            msg: "courses could not be fetched"
        })
    }
});

module.exports = router