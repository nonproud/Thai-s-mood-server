const express = require('express')
const bodyParser = require("body-parser")
const memeberDBModule = require('./database-member-module')
const recordDBModule = require('./database-record-module')
const evaluationDBModule = require('./database-evaluation-module')
const researcherDBModule = require('./database-research-module.')
const jwtModule = require('./jwt-module')

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))


// Create Account
app.post("/member", (req, res) => {
    memeberDBModule.createAccount(req, res)
})

// Update login Details
app.put('/member', (req, res) =>{
    memeberDBModule.updateLoginDetails(req, res)
})

// Get account profile
app.get("/member/profile", jwtModule.verifyTokenForGetMethod, (req, res) => {
    memeberDBModule.getAccountProfile(req, res)
})

// Create account profile
app.post("/member/profile", (req, res) => {
    memeberDBModule.createAccountProfile(req, res)
})
/**************************** end of /member/profile *****************/

// Verify Email by OTP
app.post("/member/verifyEmail", (req, res) => {
    memeberDBModule.verifyEmail(req, res)
})

// Check is email Dupplicate
app.post("/member/email", (req, res) => {
    memeberDBModule.checkIsEmailDuplicate(req, res)
})

// Check is Username dupplicate
app.post("/member/username", (req, res) => {
    memeberDBModule.checkIsUsernameDuplicate(req, res)
})

// Update account profile
app.put('/member/profile', jwtModule.verifyToken, (req, res) =>{
    res.send('meber/data')
})

// Login
app.post("/member/login", (req, res) => {
    memeberDBModule.authLogin(req, res)
})

// Get temp ID
app.post("/member/tempPassword", jwtModule.verifyToken, (req, res) =>{
    memeberDBModule.getTempPassword(req, res)
})

/* MOOD APIs */
app.post("/record/mood", jwtModule.verifyToken, (req, res) => {
    recordDBModule.createMood(req, res)
})

app.get("/record/mood", jwtModule.verifyTokenForGetMethod, (req, res) => {
    recordDBModule.getMood(req, res)
})

app.put("/record/mood", jwtModule.verifyToken, (req, res) => {
    recordDBModule.editMood(req, res)
})

app.delete("/record/mood", jwtModule.verifyToken, (req, res) => {
    recordDBModule.deleteMood(req, res)
})

/* END OF MOOD APIs */

/* SLEEP APIs */

app.post("/record/sleep", jwtModule.verifyToken, (req, res) => {
    recordDBModule.createSleep(req, res)
})

app.get("/record/sleep", jwtModule.verifyTokenForGetMethod, (req, res) => {
    recordDBModule.getSleep(req, res)
})

app.put("/record/sleep", jwtModule.verifyToken,(req, res) => {
    recordDBModule.editSleep(req, res)
})

app.delete("/record/sleep", jwtModule.verifyToken, (req, res) => {
    recordDBModule.deleteSleep(req, res)
})

/* END OF SLEEP APIs */

/* DIARY APIs */

app.post("/record/diary", jwtModule.verifyToken, (req, res) => {
    recordDBModule.createDiary(req, res)
})

app.get("/record/diary", jwtModule.verifyTokenForGetMethod,  (req, res) => {
    recordDBModule.getDiary(req, res)
})

app.put("/record/diary", jwtModule.verifyToken, (req, res) => {
    recordDBModule.editDiary(req, res)
})

app.delete("/record/diary", jwtModule.verifyToken, (req, res) => {
    recordDBModule.deleteDiary(req, res)
})

/* END OF DIARY APIs */

/* Evaluation APIs */
app.post("/evaluation", jwtModule.verifyToken, (req, res) => {
    type = req.body.type
    if(type === "2q"){
        evaluationDBModule.insert2q(req, res)
    }else if(type === "9q"){
        evaluationDBModule.insert9q(req, res)
    }else if(type === "8q"){
        evaluationDBModule.insert8q(req, res)
    }else if(type === "mdq"){
        evaluationDBModule.insertMdq(req, res)
    }
})

app.get("evaluation", jwtModule.verifyTokenForGetMethod, (req, res) =>{
    evaluationDBModule(req, res)
})
/* End of Evaluation APIs */

/* Researcher APIs */
app.get("/more/view-mood-chart", (req, res) => {
    res.header('Access-Control-Allow-Origin', "*")
    res.header('Access-Control-Allow-Methods', 'GET, POST')
    res.header('Access-Control-Allow-Headers', "Content-Type")
    researcherDBModule.getMood(req, res)
})

app.get("/more/hospital", (req, res) => {
    res.header('Access-Control-Allow-Origin', "*")
    res.header('Access-Control-Allow-Methods', 'GET, POST')
    res.header('Access-Control-Allow-Headers', "Content-Type")
    researcherDBModule.getHospital(req, res)
})
/* Researcher APIs */
 
app.listen(4553, () =>{
    console.log('Thais Mood "Main server" APIs was ran on PORT 3000')
})
