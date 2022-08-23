const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const User = mongoose.model("User")
const bcrcypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {SECRETKEY} = require('../key')
const crypto = require('crypto')
const {PASS_GMAIL} = require('../key')
const nodemailer = require('nodemailer')
const transporter = nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:"pk.uzikhan@gmail.com",
        pass: PASS_GMAIL
    }
})
router.post('/register', (req, res) => {
    const { name, email, password,userType } = req.body
    if(!name || !email || !password || !userType){
        return res.status(422).send("please put all the fields")
    }
    User.find({ email })
        .then((savedUser) => {
            if (savedUser.length !== 0) {
                return res.status(422).send("the given email is already exist")
            }
            bcrcypt.hash(password,12)
            .then(hashedPassword => {

                const user = new User({
                    name,
                    email,
                    password:hashedPassword,
                    userType
                })
                user.save()
                res.send("user creation succeeded")
            })
        })
        .catch(err => {
            res.send('signup failed',err)
        })
})


router.post('/register-with-mechanic',(req,res) => {
   let {name , email , password , userType , mechanicTypeName, latitude , longitude , workshopName , workshopAddress , workshopOpeningTime , workshopClosingTime , contactNumber , experience , description , pic , skills , city} = req.body
   console.log(req.body)
   if(!name || !email || !password || !userType || !mechanicTypeName|| !latitude || !longitude || !workshopName || !workshopAddress || !workshopOpeningTime || !workshopClosingTime || !contactNumber || !experience || !description)
   {
       return res.status(422).send("Please fill all the fields")
    }
    if(!pic){
        pic='https://res.cloudinary.com/instagramcloude/image/upload/v1658314042/dp3_ozruse.png'
    }
    User.find({email})
    .then(savedUser => {
        if(savedUser.length !== 0){
            return res.status(422).send("Mechanic already exist")
        }
        bcrcypt.hash(password,12)
        .then(hashedPassword => {
            const user = new User({
                name,
                email,
                password:hashedPassword,
                userType, 
                mechanicTypeName, 
                latitude, 
                longitude, 
                workshopName, 
                workshopAddress, 
                workshopOpeningTime, 
                workshopClosingTime, 
                contactNumber, 
                experience, 
                description,
                pic,
                city,
                skills
            })
        user.save()
        res.send("user created successfully")
    })
    .catch(err => {
        res.status(422).send("user creation failed")
    })
   })
})

router.post('/check-email-exist',(req,res) => {
    const {email} = req.body
   console.log(req.body)
    User.find({email})
    .then(savedUser => {
        
        if(savedUser.length !== 0){
            res.send(true)
        }
        else{
            res.send(false)
        }
    })
    .catch(err => {
        console.log(err)
    })
})

router.post('/sign-in', (req,res) => {
    const {email , password} = req.body
    if(!email || !password){
        return res.status(422).send({message : "Please Enter Email and Password"})
    }
    User.findOne({email})
    .then(savedUser => {
        if(!savedUser){
            return res.status(422).send({message : "User not exist"})
        }
        bcrcypt.compare(password,savedUser.password)
        .then(isMatch => {
            if(isMatch){
                const token = jwt.sign({_id:savedUser._id} , SECRETKEY)
                const {_id , name , email , userType } = savedUser
                res.send({token ,user:{_id , name , email , userType}})
            }
        })
    })
})
router.post('/need-mechanic', (req,res) => {
    const {latitude , longitude} = req.body
    User.find({latitude:req.body.latitude , longitude: req.body.longitude , mechanicTypeName:req.body.mechanicTypeName})
    .populate("skills", "_id , skill")
    .then(savedUser=> {
        res.send(savedUser)
    })
    .catch(err => {
        res.send(err)
    })
})

router.post('/book-appointment' , (req,res) => {
    const {city} = req.body
    User.find({city})
    .populate("skills", "_id , skill")
    .then(savedUser => {
        res.send(savedUser)
    })
    .catch(err => {
        res.send(err)
    })
})

router.post('/reset-password',(req , res) => {
    crypto.randomBytes(32,(err,buffer)=> {
        if(err){
            console.log(err)
        }
        const token = buffer.toString("hex")
        User.findOne({email:req.body.email})
        .then(user => {
            if(!user){
                return res.status(422).json({errror:"User dont exist with that email"})
            }
            user.resetToken = token
            user.expireToken = Date.now() + 3600000
            user.save().then((result) => {
                transporter.sendMail({
                    to:user.email,
                    from:"noreply@vba.com",
                    subject:"Reset password by Vehicle Breakdown Assistant by Uzair",
                    html:`
                    <P>You requested for password reset</p>
                    <h5>click in this <a href="http://localhost:3000/reset-password/${token}">link</a> to reset password</h5>`
                })
                res.json({message : "Check your Gmail"})
            })
        })
    }) // to create token
})

router.post('/new-password',(req,res) => {
    const newPassword = req.body.password
    const sentToken = req.body.token
    User.findOne({resetToken:sentToken})
    .then(user => {
        if(user.length === 0){
            return res.status(422).send("Try again session expired")
        }
        bcrcypt.hash(newPassword,12).then(hashedPassword => {
            user.password = hashedPassword
            user.resetToken = undefined
            user.expireToken = undefined
            user.save()
            .then(savedUser => {
                res.send("password updated successfully")
            })
            .catch(err => {
                res.send("err")
            })
        })
    })
    .catch(err => {
        res.send("err" ,err)
    })
})
module.exports = router