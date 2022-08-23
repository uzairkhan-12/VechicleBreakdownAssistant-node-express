const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const ContactUs = mongoose.model('ContactUs')
const {PASS_GMAIL} = require('../key')
const nodemailer = require('nodemailer')
const transporter = nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:"pk.uzikhan@gmail.com",
        pass: PASS_GMAIL
    }
})
router.get('/get-complains',(req,res) => {
   ContactUs.find()
   .then(savedDetail => {
    res.send(savedDetail)
   })
   .catch(err => {
    res.send(err)
   })
})
router.post('/add-complain',(req,res) => {
    const {name , email , message} = req.body
    if(!name , !email,!message){
        return res.status(422).send("please fill all the required data")
    }
    const contactus = new ContactUs({
        name,
        email,
        message
    })
    contactus.save()
    res.send("message submitted successfully")
})


router.delete('/delete-complain/:id',(req,res) => {
    ContactUs.deleteOne({_id : req.params.id})
    .then(()=> {
        res.send({message:"complain deleted successfully"})
    })
    .catch(err => {
        res.send("Error :" , err)
    })
})
router.post('/replying-complains',(req,res) => {
    const { email , message} = req.body
    transporter.sendMail({
        to:email,
        from:"no-reply@gmail.com",
        subject:"Vehicle Breakdown Assistant",
        html:message +" "+"<br/>"+"<h5>Regards</h5>"+"<br/>"+"<h5>Vehicle Breakdown Assistant</h5>"
    })
    .then((response) => {
        res.send("message sent")
    })
    .catch(err => {
        res.status(422).send("you are facing some problem")
    })
})
module.exports=router