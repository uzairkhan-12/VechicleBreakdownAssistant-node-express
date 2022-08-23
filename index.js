const express = require('express')
const app = express()
const mongoose = require('mongoose')
const { MONGOURI } = require('./key')
var cors = require('cors')
app.use(cors())
mongoose.connect(MONGOURI)

app.use(express.json())
require('./models/user')
require('./models/skills')
require('./models/mechanicType')
require('./models/contactUs')
app.use(require('./routes/auth'))
app.use(require('./routes/skills'))
app.use(require('./routes/mechanicType'))
app.use(require('./routes/contactus'))
mongoose.connection.on('connected',()=>{
    console.log('connected to mongodb')
})
mongoose.connection.on('error',(err)=>{
    console.log({error : err})
})

app.listen('5000',() => {
    console.log('app is running')
})