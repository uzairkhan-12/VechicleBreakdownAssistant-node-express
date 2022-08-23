
const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const MechanicType = mongoose.model('MechanicType')

router.get('/get-mechanic-types',(req,res) =>{
    MechanicType.find()
    .then(savedMechanicType => {
        res.send(savedMechanicType)
    })
})
router.post('/add-mechanic-type',(req,res) => {
    const {mechanicType} = req.body
    MechanicType.find({mechanicType})
    .then(savedMechanicType => {
        if(savedMechanicType.length !== 0){
            return res.status(422).send({message:"mechanic type already exist"})
        }
        const mechanicTypes = new MechanicType({
            mechanicType
        })
        mechanicTypes.save()
        res.send("mechanic type added successfully")
    })
})

router.delete('/delete-mechanic-type/:id',(req,res) => {
    MechanicType.deleteOne({_id : req.params.id})
    .then(() => {
        res.send({message : "mechanic type deleted successfuly"})
    })
    .catch(err => {
        res.send({"Error ": err})
    })
})

router.put('/udpate-mechanic-type/:id',(req,res) => {
    const {mechanicType} = req.body
    MechanicType.find({mechanicType})
    .then(savedMechanicType => {
        if(savedMechanicType.length !== 0){
            return res.status(422).send({message : "Mechanic Type already exist"})
        }
        MechanicType.findByIdAndUpdate(req.params.id , { mechanicType }, function(err , result) {
            if(err){
                res.send({"Error " : err})
            }
            else{
                res.send({message : "Mechanic type updated successfully"})
            }
        })
    })
})

module.exports = router