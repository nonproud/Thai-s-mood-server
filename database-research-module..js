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


function getMood(req, res){
    token = req.query.token
    console.log("Find someone with token: " + token)
    getUsernameQueryString = "SELECT username FROM login WHERE token = '" + token + "'"
    pool.getConnection().then(conn => {
        conn.query(getUsernameQueryString).then((result) => {
            usermane = result[0].username
            console.log("Token " + token + " is" + result[0].username)
            
            getmood_query = "SELECT emotion, level, date FROM emotion WHERE username = '" + result[0].username + "'"
            console.log(getmood_query)
            conn.query(getmood_query).then((emotion) => {
                    objs = [];
                    objs.push({username: result[0].username, emotion: emotion})
                    res.status(201).send(objs)
                    console.log("Token: " + token + " Username: " + result[0].username + ", get emotion complete.")
                    close(conn)
            }).catch(err =>{

            })    

        }).catch(err => {
        
        })

    })
    
    
    

}

function getUsername(token, callback){
    getUsernameQueryString = "SELECT username FROM login WHERE token = '" + token + "'"
    
    
}