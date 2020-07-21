const connectionString = process.env.DATABASE_URL
const { Pool } = require('pg')
const pool = new Pool({
    connectionString: connectionString
})

const jwt_module = require("./jwt-module")

module.exports = {
    insert2q: insert2q,
    insert9q: insert9q,
    insert8q: insert8q,
    insertMdq: insertMdq,
    getEvaluation: getEvaluation
}

function insert2q(req, res) {
    score = req.body.score
    date = req.body.date
    username = req.body.username
    sql = "INSERT INTO evaluation(username, _2q, date) values('" + username + "', " + score + ", '" + date + "');"
    pool.query(sql).then(result => {
        res.status(201).send("1")
        // pool.end()
    }).catch(err => {
        console.log(err)
        res.status(502).send("Can't done your request")
        // pool.end()
    })

}

function insert9q(req, res) {
    score = req.body.score
    date = req.body.date
    username = req.body.username
    sql = "UPDATE evaluation SET _9q = " + score + " WHERE username = '" + username + "' AND date = '" + date + "';"

    pool.query(sql).then(result => {
        res.status(201).send("1")
        // pool.end()
    }).catch(err => {
        console.log(err)
        res.status(502).send("Can't done your request")
        // pool.end()
    })
}

function insert8q(req, res) {
    score = req.body.score
    date = req.body.date
    username = req.body.username
    sql = "UPDATE evaluation SET _8q = " + score + " WHERE username = '" + username + "' AND date = '" + date + "';"
    pool.query(sql).then(result => {
        res.status(201).send("1")
        // pool.end()
    }).catch(err => {
        console.log(err)
        res.status(502).send("Can't done your request")
        // pool.end()
    })
}

function insertMdq(req, res) {
    score = req.body.score
    date = req.body.date
    username = req.body.username
    sql = "UPDATE evaluation SET mdq = " + score + " WHERE username = '" + username + "' AND date = '" + date + "';"
    pool.query(sql).then(result => {
        res.status(201).send("1")
        // pool.end()
    }).catch(err => {
        console.log(err)
        res.status(502).send("Can't done your request")
        // pool.end()
    })
}

function getEvaluation(req, res) {
    username = req.query.username
    sql = "SELECT _2q, _9q, _8q, mdq, date FROM evaluation WHERE username = '" + username + "';"
    console.log(sql)
    pool.query(sql).then(result => {
        res.status(201).json({
            "result": result
        })
        // pool.end()
    }).catch(err => {
        console.log(err)
        res.status(502).send("Can't done your request")
        // pool.end()
    })

}
