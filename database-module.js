/*MariaDB version */
const mariadb = require('mariadb');
const pool = mariadb.createPool({
    host: 'localhost',
    user: 'api',
    password: 'password',
    database: 'thaismood',
    connectionLimit: 5
});
const bcrypt = require('bcrypt')
const saltRounds = 15
const mail_sender = require('./mail-sender')

module.exports = {
    createAccount: createAccount
}

function createAccount(req, res) {
    bcrypt.genSalt(saltRounds, (err, salt) => {
        bcrypt.hash(req.body.passwd, salt, (err, hash) => {
            var id = generateID() ,otp = generateOTP(), email = req.body.email
            var values = "'" + id + "', '" + email + "', '" + hash + "', '" + otp + "', " + 0 ;

            pool.getConnection().then(conn => {
                
                conn.query("INSERT INTO login (id, email, password, otp, is_verified) VALUES (" + values + ");").then( (result) => {
                    console.log(id)
                    mail_sender.sendValidateMail(email, otp)
                    res.status(201).send(id)
                })
            })

        })
    })
}



function generateID() {
    var id = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 20; i++)
        id += possible.charAt(Math.floor(Math.random() * possible.length));

    return id;
}

function generateOTP() {
    var otp = "";
    var possible = "0123456789";

    for (var i = 0; i < 4; i++)
        otp += possible.charAt(Math.floor(Math.random() * possible.length));

    return otp;
}