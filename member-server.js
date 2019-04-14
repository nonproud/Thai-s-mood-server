const express = require('express')
const bodyParser = require("body-parser")
const jwt = require("jwt-simple") 
const database = require('./database-module')

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const SECRET = "this is a real thai's mood server!"

/*********** Middle ware zone **********************************/

const loginMiddle = (req, res, next) => {
    id - req,body.id
    email = req.body.email
    password = req.body.password
    if(database.authLogin(id, email, password) != true){
        next()
    }else{
        res.send("0")
    }
}

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

app.post("/member/otp", (req, res) => {
    database.verifyOTP(req, res)
})

app.post("/member/email", (req, res) => {
    database.checkIsEmailDuplicate(req, res)
})
/********************************** End of Finished ******************/



app.put('/member/profile', (req, res) =>{
    res.send('meber/data!')
})

app.post("/member/login", loginMiddle, (req, res) => {
    const payload = {
        sub: req.body.email,
        id: req.body.id,
        iat: new Date().getTime() // issued at time
     }
     res.send(jwt.encode(payload, SECRET))
})


 
app.listen(4553, () =>{
    console.log("Thais Mood 'Member' API was ran on PORT 4553;")
})
