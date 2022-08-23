const mongoose = require('mongoose')
const skillsSchema = new mongoose.Schema({
    skill:{
        type:String,
        required:true
    }
})

mongoose.model("Skills",skillsSchema)