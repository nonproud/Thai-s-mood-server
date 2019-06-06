const test = require("./jwt-module")
const express = require("express");
const bodyParser = require("body-parser")
const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const SECRET = "this is a real thai's mood server!"



app.post("/login", (req, res) => {
    username = req.body.username
    password = req.body.password
      
    if(username === "nonproud" && password === "1234"){

        test.getAndSentToken(username, "panphinit@gmail.com", " 1", res)

    }else{
        res.status(401).send("FAILED!")
    }
})

app.get("/get", test.verifyToken, (req, res) => {
    res.send("SUCCESS")
})


app.listen(4553, () =>{
    console.log("Thais Mood 'Member' API was ran on PORT 4553;")
})


