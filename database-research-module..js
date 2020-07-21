const connectionString = process.env.DATABASE_URL
const { Pool, Client } = require('pg')
const pool = new Pool({
    connectionString: connectionString
})
const jwt = require("jwt-simple")


module.exports = {
    getMood: getMood,
    getHospital: getHospital
}


function getUsername(token, callback) {

    getUsernameQueryString = "SELECT username FROM login WHERE token = '" + token + "'"
    return pool.query(getUsernameQueryString).then(result => {
        uname = result[0].username
        console.log("sql " + uname)
        // pool.end()
        return callback(null, uname)
    }).catch(err => {
        // pool.end()
        return callback(err, null)
    })
}

function getMood(req, res) {
    token = req.query.token
    console.log("Looking for token: " + token)
    uname = getUsername(token, (err, username) => {
        if (err)
            throw err
        console.log("Found token: " + token + " is: " + username)
        // SELECT emotion, level, date FROM emotion WHERE username = 'nonproud' ORDER BY date ASC
        getMood_sql = "SELECT emotion, level, date FROM emotion WHERE username = '" + username +
            "' ORDER BY date ASC;"

        return pool.query(getMood_sql).then(err, result => {
            if (err)
                throw err;
            objs = [];
            objs.push({ username: username, emotion: result })
            res.status(201).send(objs)
            console.log("Complete tranfer emotion for: " + token + " username: " + username + " :P")
            // pool.end()
        }).catch(err => {
            res.status(502).send("OPPS!")
            // pool.end()
        })
    })
}

function getHospital(req, res) {
    province = req.query.province
    sql = "SELECT name, type, province, address FROM emergency WHERE province = '" + province + "';"
    pool.query(sql).then(result => {
        res.status(201).send(result)
        // pool.end()
    }).catch(err => {
        res.status(502).send(err)
    })
}
