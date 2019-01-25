const express = require('express')
const mongdoClient = require('mongodb').MongoClient
const app = express()




app.get('/express', (req, res) => {
    res.send('This is Express!')
})

app.get('/researcher', (req, res) => {
    var db
    mongdoClient.connect('mongodb://127.0.0.1:27017', { useNewUrlParser: true }, (err, client) => {
    if(err) return console.log("Failed" + err)
    db = client.db('Thai-s-mood-database')
    db.collection("researcher").find().toArray((err, results) => {
        // console.log(results);
        res.send(results)
    })
    
    // console.log("Database connected!")
    })
})

app.listen(4553, () =>{
    console.log("Hit!")
})