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
    sql = "SELECT * FROM environment WHERE 1";
    console.log(sql)
    pool.getConnection().then(conn => {
        conn.query(sql).then(result => {
            console.log("mailpass: " + JSON.parse(result).emailPassword)
            var password = obj.emailPassword
            password =  result["emailPassword"]
            conn.end()
            console.log("mailpass: " + password)
            return password
            
        }).catch(err => {
            console.log(err)
            conn.end()
        })
    })
}