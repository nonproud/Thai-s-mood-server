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
    createAccount: createAccount,
    getNewOTP: getNewOTP,
    createAccountProfile: createAccountProfile,
    getAccountProfile: getAccountProfile,
    updateLoginDetails: updateLoginDetails
    
}

function createAccount(req, res) {
    bcrypt.genSalt(saltRounds, (err, salt) => {
        bcrypt.hash(req.body.passwd, salt, (err, hash) => {
            var id = generateID(), otp = generateOTP(), email = req.body.email
            var values = "'" + id + "', '" + email + "', '" + hash + "', '" + otp + "', " + 0;

            pool.getConnection().then(conn => {

                conn.query("INSERT INTO login (id, email, password, otp, is_verified) VALUES (" + values + ");").then((result) => {
                    console.log(id)
                    mail_sender.sendValidateMail(email, otp)
                    res.status(201).send(id)
                    conn.end()
                }).catch(err => {
                    res.status(502).send("Cant create user profile now, Try again later.")
                })
            })

        })
    })
}

function getNewOTP(req, res){
    var newotp = generateOTP()
    var id = req.body.id
    var email = req.body.email
    pool.getConnection().then(conn => {
        var sql = "UPDATE login SET email = '" + email + "', otp = '" + newotp + "' WHERE id = '" + id + "'"
        conn.query(sql).then((result) => {
            mail_sender.sendValidateMail(email, otp)
            res.status(201).send("Successfully.")
            conn.end()
        }).catch(err => {
            res.status(502).send("Failed")
        })
    })
}

function createAccountProfile(req, res) {
    var body = req.body
    var id = body.userID
    var name = body.name
    var lname = body.lastname
    var gender = body.gender
    var type = body.type
    var is_pregnant = body.is_pregnant
    var addiction = body.addiction
    var caffeine = body.caffeine
    var disorder = body.disorder
    var is_treat = body.is_treat
    var hospital = body.hospital
    var hn = body.hn
    var emer_cont = body.emergency_contact

    var value = "'" + id + "', " + name + "', " + lname + "', " + gender + "', " + type + "', " + is_pregnant + "', " + addiction +
        "', " + caffeine + "', " + disorder + "', " + is_treat + "', " + hospital + "', " + hn + "', " + emer_cont

    pool.getConnection().then(conn => {
        var sql = "INSERT INTO user_profile" +
            "(id, name, lastname, gender, type, is_pregnant, addiction, caffeine, disorder, is_treat, hospital, hn, emergency_contact)" +
            "VALUES (" + value + ")"
        conn.query(sql).then((result) => {
            res.status(201).send("Insert " + name + "'s profile successfully.")
            conn.end()
        }).catch(err => {
            res.status(502).send("Cant create user profile now, Try again later.")
        })

    })
}

function getAccountProfile(req, res) {
    var userID = req.body.id
    pool.getConnection().then(conn => {
        var sql = "SELECT * FROM user_profile WHERE id = '" + userID + "'"
        conn.query(sql).then((result) => {
            console.log(result)
            res.status(201).send(result)
            conn.end()
        }).catch(err => {
            res.status(502).send("Cant create user profile now, Try again later.")
        })

    })
}

function updateLoginDetails(req, res) {
    var id = req.body.id
    var email = req.body.email
    var passwd = req.body.password
    var status = false

    if (email != "NULL") {
        var newotp = generateOTP()
        pool.getConnection().then(conn => {
            var sql = "UPDATE login SET email = '" + email + "', otp = '" + newotp + "' WHERE id = '" + id + "'"
            conn.query(sql).then((result) => {
                mail_sender.sendValidateMail(email, otp)
                conn.end()
                stauts = true
            }).catch(err => {
                stauts = false
            })
        })

    } else if (password != "NULL") {
        bcrypt.genSalt(saltRounds, (err, salt) => {
            bcrypt.hash(req.body.passwd, salt, (err, hash) => {
                pool.getConnection().then(conn => {
                    var sql = "UPDATE login SET password = '" + hash + "' WHERE id = '" + id + "'"
                    conn.query(sql).then((result) => {
                        conn.end()
                        stauts = true
                    }).catch(err => {
                        stauts = false
                    })
                })
            })
        })
    }

    if (status) {
        res.status(201).send("Update detials Successfully.")
    } else {
        res.status(502).send("Unable to update detials, Please try again later.")
    }
}

function authLogin(req, res){
    
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