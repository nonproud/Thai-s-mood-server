const express = require('express')
const bodyParser = require('body-parser')
const database = require('./database-record-module')


const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

/* MOOD APIs */

app.post("/record/mood", (req, res) => {
    console.log(req.body)
    res.status(201).json(req.body)
})

app.get("/record/mood", (req, res) => {
    console.log(req.body)
    res.status(201).json(req.body)
})

app.put("/record/mood", (req, res) => {
    console.log(req.body)
    res.status(201).json(req.body)
})

app.delete("/record/mood", (req, res) => {
    console.log(req.body)
    res.status(201).json(req.body)
})

/* END OF MOOD APIs */

/* SLEEP APIs */

app.post("/record/sleep", (req, res) => {
    console.log(req.body)
    res.status(201).json(req.body)
})

app.get("/record/sleep", (req, res) => {
    console.log(req.body)
    res.status(201).json(req.body)
})

app.put("/record/sleep", (req, res) => {
    console.log(req.body)
    res.status(201).json(req.body)
})

app.delete("/record/sleep", (req, res) => {
    console.log(req.body)
    res.status(201).json(req.body)
})

/* END OF SLEEP APIs */

/* DIARY APIs */

app.post("/record/diary", (req, res) => {
    console.log(req.body)
    res.status(201).json(req.body)
})

app.get("/record/diary", (req, res) => {
    console.log(req.body)
    res.status(201).json(req.body)
})

app.put("/record/diary", (req, res) => {
    console.log(req.body)
    res.status(201).json(req.body)
})

app.delete("/record/diary", (req, res) => {
    console.log(req.body)
    res.status(201).json(req.body)
})

/* END OF DIARY APIs */

app.listen(5553, () =>{
    console.log("Thais Mood 'Record' API was ran on PORT 5553;")
})