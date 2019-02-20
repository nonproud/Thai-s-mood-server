const express = require('express')
const mongdoClient = require('mongodb').MongoClient
const bodyParser = require('body-parser')

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/express', (req, res) => {
    res.send('This is Express!')
})

app.get('/member/login/checklogin', (req, res) =>{
    res.send('Well done!')
})

app.post("/member", (req, res) => {
    console.log(req.body)
    res.status(201).json(req.body)
})

app.listen(4553, () =>{
    console.log("Hit!")
})