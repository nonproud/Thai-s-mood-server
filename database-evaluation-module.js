/*MariaDB version */
const mariadb = require('mariadb');
const pool = mariadb.createPool({
    host: 'localhost',
    port: 3306,
    user: 'api',
    password: 'password',
    database: 'thaismood',
    connectionLimit: 20
});
const jwt_module = require("./jwt-module")


module.exports = {
    insert2q: insert2q,
    insert9q: insert9q,
    insert8q: insert8q,
    insertMdq: insertMdq,
    getEvaluation: getEvaluation
}

function insert2q(req, res){
    score = req.body.score
    date = req.body.date
    username = req.body.username
    sql = "INSERT INTO evaluation(username, 2q, date) values('" + username + "', " + score + ", '" + date + "');"
    pool.getConnection().then(conn =>{
        conn.query(sql).then(result => {
            res.status(201).send("1")
            conn.end()
        }).catch(err => {
            console.log(err)
            res.status(502).send("Can't done your request")
            conn.end()
        })
    })
}

function insert9q(req, res){
    score = req.body.score
    date = req.body.date
    username = req.body.username
    sql = "UPDATE evaluation SET 9q = " + score + " WHERE username = '" + username + "' AND date = '" + date + "';"
    pool.getConnection().then(conn =>{
        conn.query(sql).then(result => {
            res.status(201).send("1")
            conn.end()
        }).catch(err => {
            console.log(err)
            res.status(502).send("Can't done your request")
            conn.end()
        })
    })
}

function insert8q(req, res){
    score = req.body.score
    date = req.body.date
    username = req.body.username
    sql = "UPDATE evaluation SET 8q = " + score + " WHERE username = '" + username + "' AND date = '" + date + "';"
    pool.getConnection().then(conn =>{
        conn.query(sql).then(result => {
            res.status(201).send("1")
            conn.end()
        }).catch(err => {
            console.log(err)
            res.status(502).send("Can't done your request")
            conn.end()
        })
    })
}

function insertMdq(req, res){
    score = req.body.score
    date = req.body.date
    username = req.body.username
    sql = "UPDATE evaluation SET mdq = " + score + " WHERE username = '" + username + "' AND date = '" + date + "';"
    pool.getConnection().then(conn =>{
        conn.query(sql).then(result => {
            res.status(201).send("1")
            conn.end()
        }).catch(err => {
            console.log(err)
            res.status(502).send("Can't done your request")
            conn.end()
        })
    })
}

function getEvaluation(req, res){
    username = req.query.username
    sql = "SELECT * FROM evaluation WHERE username = '" + username + "';"
    console.log(sql)
    pool.getConnection().then(conn =>{
        conn.query(sql).then(result => {
            res.status(201).send(result[0])
            conn.end()
        }).catch(err => {
            console.log(err)
            res.status(502).send("Can't done your request")
            conn.end()
        })
    })
}