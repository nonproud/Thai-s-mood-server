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
    getEmailPassword: this.getEmailPassword
}

function getEmailPassword(){
    sql = "SELECT emailPassword from evironmet where 1";
    console.log(sql)
    pool.getConnection().then(conn => {
        conn.query(sql).then(result => {
            conn.end()
            return result[0]
            
        }).catch(err => {
            res.status(502).send("err")
            console.log(err)
            conn.end()
        })
    })
}