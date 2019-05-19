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

}

function getMood(req, res){
    
}