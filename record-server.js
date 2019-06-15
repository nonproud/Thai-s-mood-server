const express = require('express')
const bodyParser = require('body-parser')
const database = require('./database-record-module')
const jwt_module = require('./jwt-module')


const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

/* MOOD APIs */

app.post("/record/mood", jwt_module.verifyToken, (req, res) => {
    database.createMood(req, res)
})

app.get("/record/mood", jwt_module.verifyTokenForGetMethod, (req, res) => {
    database.getMood(req, res)
})

app.put("/record/mood", jwt_module.verifyToken, (req, res) => {
    database.editMood(req, res)
})

app.delete("/record/mood", jwt_module.verifyToken, (req, res) => {
    database.deleteMood(req, res)
})

/* END OF MOOD APIs */

/* SLEEP APIs */

app.post("/record/sleep", jwt_module.verifyToken, (req, res) => {
    database.createSleep(req, res)
})

app.get("/record/sleep", jwt_module.verifyTokenForGetMethod, (req, res) => {
    database.getSleep(req, res)
})

app.put("/record/sleep", jwt_module.verifyToken,(req, res) => {
    database.editSleep(req, res)
})

app.delete("/record/sleep", jwt_module.verifyToken, (req, res) => {
    database.deleteSleep(req, res)
})

/* END OF SLEEP APIs */

/* DIARY APIs */

app.post("/record/diary", jwt_module.verifyToken, (req, res) => {
    database.createDiary(req, res)
})

app.get("/record/diary", jwt_module.verifyTokenForGetMethod,  (req, res) => {
    database.getDiary(req, res)
})

app.put("/record/diary", jwt_module.verifyToken, (req, res) => {
    database.editDiary(req, res)
})

app.delete("/record/diary", jwt_module.verifyToken, (req, res) => {
    database.deleteDiary(req, res)
})

/* END OF DIARY APIs */

app.listen(5553, () =>{
    console.log("Thais Mood 'Record' API was ran on PORT 5553;")
})