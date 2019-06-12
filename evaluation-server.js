const express = require('express')
const bodyParser = require('body-parser')
const db = require('./database-evaluation-module')
const jwtModule = require('./jwt-module')


const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.post("/evaluation", jwtModule.verifyToken, (req, res) => {
    type = req.body.type
    if(type === "2q"){
        db.insert2q(req, res)
    }else if(type === "9q"){
        db.insert9q(req, res)
    }else if(type === "8q"){
        db.insert8q(req, res)
    }else if(type === "mdq"){
        db.insertMdq(req, res)
    }
})

app.get("evaluation", jwtModule.verifyToken, (req, res) =>{
    getEvaluation(req, res)
})

app.listen(6553, () =>{
    console.log("Thais Mood 'Evaluation' API was ran on PORT 5553;")
})