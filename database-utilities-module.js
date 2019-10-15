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

module.exports = {
    getEmailPassword: getEmailPassword
}

function getEmailPassword(callback){
    sql = "SELECT * FROM environment WHERE 1";
    console.log(sql)
    pool.getConnection().then(conn => {
        conn.query(sql).then(result => {
            password = result[0].emailPassword
            conn.end()
            callback(password)
            
        }).catch(err => {
            console.log(err)
            conn.end()
        })
    })
}