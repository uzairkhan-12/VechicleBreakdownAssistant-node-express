const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Skills = mongoose.model("Skills")

router.get('/get-skills',(req,res) => {
    Skills.find()
    .then(savedSkills => {
        res.send(savedSkills)
    })
    .catch(err => {
        res.send({error , err})
    })
})
router.post('/add-skill' , (req,res) => {
    const { skill } = req.body
   Skills.find({skill})
   .then(savedSkill => {
    if(savedSkill.length !== 0){
       return res.status(422).send("skill already exist")
    }
    const skills = new Skills({
        skill
    })
    skills.save()
    res.send("skill added successfuly")
   })
})

router.put('/edit-skill/:id' ,(req,res) => {
    const {skill} = req.body
    
    Skills.find({skill})
    .then(savedSkill => {  
        if(savedSkill.length !== 0){
            return res.status(422).send({message:"Skill already exist"})
        }
        Skills.findByIdAndUpdate(req.params.id , {skill} , function(err , result){
           
            if(err){
                res.status(422).send({"Error " : err})
            }
            else{
                res.send({message : "Skill Updated Successfully"})
            }
        })
    })
})

router.delete('/delete-skill/:id' , (req,res) => {
    Skills.deleteOne({_id : req.params.id})
    .then( ()=> {
        res.send("skill deleted successully")
    })
    .catch(err => {
        res.send("error :",err)
    })
})

module.exports = router