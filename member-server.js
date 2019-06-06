const express = require('express')
const bodyParser = require("body-parser")
const database = require('./database-member-module')

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

/*********** Middle ware zone **********************************/

/*********** End of Middle ware zone ***************************/


/*********************************Finished **************************/
/***************************** /member ********************************/
app.post("/member", (req, res) => {
    database.createAccount(req, res)
})

app.put('/member', (req, res) =>{
    database.updateLoginDetails(req, res)
})
/**************************** end of /member *************************/

/**************************** /member/profile ************************/
app.get("/member/profile", (res, req) => {
    database.getAccountProfile(req, res)
})

app.post("/member/profile", (req, res) => {
    database.createAccountProfile(req, res)
})
/**************************** end of /member/profile *****************/

app.post("/member/verifyEmail", (req, res) => {
    database.verifyEmail(req, res)
})

app.post("/member/email", (req, res) => {
    database.checkIsEmailDuplicate(req, res)
})

app.post("/member/username", (req, res) => {
    database.checkIsUsernameDuplicate(req, res)
})
/********************************** End of Finished ******************/



app.put('/member/profile', (req, res) =>{
    res.send('meber/data!')
})

app.post("/member/login", (req, res) => {
    database.authLogin(req, res)
})


 
app.listen(4553, () =>{
    console.log("Thais Mood 'Member' API was ran on PORT 4553;")
})
