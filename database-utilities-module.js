const connectionString = process.env.DATABASE_URL
const { Pool, Client } = require('pg')
const pool = new Pool({
    connectionString: connectionString
})


module.exports = {
    getEmailPassword: getEmailPassword
}

function getEmailPassword(callback) {
    sql = "SELECT * FROM environment WHERE 1";
    console.log(sql)
    pool.query(sql).then(result => {
        password = result[0].emailPassword
        // pool.end()
        callback(password)

    }).catch(err => {
        console.log(err)
        // pool.end()
    })
}
