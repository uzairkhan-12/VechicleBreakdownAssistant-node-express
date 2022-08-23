const mongoose = require('mongoose')
const mechanicTypeSchema = new mongoose.Schema({
    mechanicType:{
        type:String,
        required:true
    }
})
mongoose.model("MechanicType",mechanicTypeSchema)