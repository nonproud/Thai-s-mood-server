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

function getEmailPassword(){
    sql = "SELECT * from environment where 1";
    console.log(sql)
    pool.getConnection().then(conn => {
        conn.query(sql).then(result => {
            console.log("mailpass: " + result)
            password =  result
            conn.end()
            console.log("mailpass: " + password)
            return password
            
        }).catch(err => {
            console.log(err)
            conn.end()
        })
    })
}