/*MariaDB version */
const mariadb = require('mariadb');
const pool = mariadb.createPool({
    host: 'localhost',
    port: 3306,
    user: 'api',
    password: 'password',
    database: 'thaismood',
    connectionLimit: 5
});
const jwt = require("jwt-simple")

const SECRET = "this is a real thai's mood server!"

module.exports = {
    getMood: getMood
}


function getUsername(token, callback){
    
    getUsernameQueryString = "SELECT username FROM login WHERE token = '" + token + "'"
    return pool.getConnection().then((conn) => {
        conn.query(getUsernameQueryString).then(result => {
            uname = result[0].username
            console.log("sql " + uname )
            conn.close()
            return callback(null, uname)
        }).catch(err => {
            return callback(err, null)
        })

    })
    
    
}

function getMood(req, res){
    token = req.query.token
    console.log("Looking for token: " + token)
    uname =  getUsername(token, (err, username) => {
        if(err)
        throw err
        console.log("Found token: " + token + " is: " + username)
        // SELECT emotion, level, date FROM emotion WHERE username = 'nonproud' ORDER BY date ASC
        getMood_sql = "SELECT emotion, level, date FROM emotion WHERE username = '" + username +
            "' ORDER BY date ASC;"

        return pool.getConnection().then(conn => {
            conn.query(getMood_sql).then(err, result =>{
                if(err)
                    throw err;
                objs = [];
                    objs.push({username: username, emotion: result})
                    res.status(201).send(objs)
                    console.log("Complete tranfer emotion for: " + token + " username: " + username + " :P")
                    close(conn)
            }).catch(err => {
                res.status(502).send("OPPS!")
            })
        })
        
    })
    
   
    

}

