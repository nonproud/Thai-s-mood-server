const express = require('express')
const bodyParser = require('body-parser')
const database = require('./database-module')


const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.post("/record", (req, res) => {
    console.log(req.body)
    res.status(201).json(req.body)
})

app.put('/record', (req, res) =>{
    res.send('Well done!')
})

app.delete('/record', (req, res) =>{
    res.send('Well done!')
})

app.listen(4553, () =>{
    console.log("Thais Mood 'Record' API was ran on PORT 5553;")
})