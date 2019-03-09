const express = require('express')
const bodyParser = require('body-parser')
const database = require('./database-module')

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))



app.post("/member", (req, res) => {
    database.createAccount(req, res)
})

app.put('/member', (req, res) =>{
    res.send('member')
    var c = database.connectMemberDetails()
})

app.delete('/member', (req, res) =>{
    res.send('member Well done!')
})

app.post("/member/data", (req, res) => {
    database.insertNewMemberDetails(req, res)
})

app.put('/member/data', (req, res) =>{
    res.send('meber/data!')
})

app.delete('/member/data', (req, res) =>{
    res.send('member/data Well done!')
})

app.post("/member/login", (req, res) => {
    console.log(req.body)
    res.status(201).json(req.body)
})

app.listen(4553, () =>{
    console.log("Thais Mood 'Member' API was ran on PORT 4553;")
})
