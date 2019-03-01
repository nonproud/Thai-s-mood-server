const express = require('express')
const bodyParser = require('body-parser')
const database = require('./database-module')

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.listen(6553, () =>{
    console.log("Thais Mood 'Questionare' API was ran on PORT 6553;")
})