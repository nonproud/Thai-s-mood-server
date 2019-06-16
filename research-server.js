const express = require('express')
const bodyParser = require('body-parser')
const database = require('./database-research-module.')


const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get("/more/view-mood-chart", (req, res) => {
    res.header('Access-Control-Allow-Origin', "*")
    res.header('Access-Control-Allow-Methods', 'GET, POST')
    res.header('Access-Control-Allow-Headers', "Content-Type")
    database.getMood(req, res)
})

app.get("/more/hospital", (req, res) => {
    res.header('Access-Control-Allow-Origin', "*")
    res.header('Access-Control-Allow-Methods', 'GET, POST')
    res.header('Access-Control-Allow-Headers', "Content-Type")
    database.getHospital(req, res)
})


app.listen(7553, () =>{
    console.log("Thais Mood 'Research' API was ran on PORT 7553;")
})

