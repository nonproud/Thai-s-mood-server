/*MariaDB version */
const mariadb = require('mariadb');
const jwt = require("jwt-simple") 
const pool = mariadb.createPool({
    host: 'localhost',
    port: 3306,
    user: 'api',
    password: 'password',
    database: 'thaismood',
    connectionLimit: 5
});
const bcrypt = require('bcrypt')
const saltRounds = 15
const mail_sender = require('./mail-sender')
const SECRET = "this is a real thai's mood server!"

module.exports = {
    getSecret: getSecret,
    authLogin: authLogin,
    createAccount: createAccount,
    getNewOTP: getNewOTP,
    createAccountProfile: createAccountProfile,
    getAccountProfile: getAccountProfile,
    updateLoginDetails: updateLoginDetails,
    verifyOTP: verifyOTP,
    checkIsEmailDuplicate: checkIsEmailDuplicate

}

function createAccount(req, res) {
    bcrypt.genSalt(saltRounds, (err, salt) => {
        bcrypt.hash(req.body.password, salt, (err, hash) => {
            var id = generateID(), otp = generateOTP(), email = req.body.email
            var values = "'" + id + "', '" + email + "', '" + hash + "', '" + otp + "', " + 0;

            pool.getConnection().then(conn => {

                conn.query("INSERT INTO login (id, email, password, otp, is_verified) VALUES (" + values + ");").then((result) => {
                    console.log(id)
                    mail_sender.sendValidateMail(email, otp)
                    res.status(201).send(id)
                    conn.end()
                }).catch(err => {
                    console.log(err)
                    res.status(502).send("Cant create user profile now, Try again later.")
                })
            })

        })
    })
}

function getNewOTP(req, res) {
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

function getSecret() {
    return SECRET
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

    } else if (passwd != "NULL") {
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

function authLogin(req, res) {

    pool.getConnection().then(conn => {
        id = req.body.id
        email = req.body.email
        password = req.body.password
        conn.query("SELECT * FROM login WHERE id = '" + id + "' AND email = '" + email + "';")
            .then((result) => {
                bcrypt.compare(password, result[0].password, (err, result) => {
                    if (err) throw err
                    if (result) {
                        const payload = {
                            sub: req.body.email,
                            id: req.body.id,
                            iat: new Date().getTime() // issued at time
                        }
                        res.send(jwt.encode(payload, SECRET))
                    } else {
                        res.send("0")
                    }
                })
                conn.end()
            }).catch(err => {
                console.log(err)
                res.status(502).send("Cant login now, Try again later.")
            })
    })
}

function verifyOTP(req, res) {
    var email = req.body.email
    var otp = req.body.otp
    pool.getConnection().then(conn => {
        var sql = "SELECT * FROM login WHERE email = '" + email + "' AND otp = '" + otp + "'"
        conn.query(sql).then((result) => {
            if (!result.length) {
                console.log("Email: " + email + " verify status: failed")
                res.status(201).send("0")
                conn.end()
            } else {
                console.log("Email " + email + " verify status: success")
                res.status(201).send("1")
                pool.getConnection().then(conn => {
                    var sql2 = "UPDATE login SET is_verified = 1 WHERE email = '" + email + "'"
                    conn.query(sql2).then(result => {
                        console.log("Email: " + email + " change verify status: success")
                        conn.close
                    }).catch(err => {
                        console.log("Email: " + email + " change verify status: failed")
                    })
                })
                conn.end()
            }

        }).catch(err => {
            res.status(502).send("Can't verify OTP NOW!")
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

function checkIsEmailDuplicate(req, res) {
    var email = req.body.email
    pool.getConnection().then(conn => {
        var sql = "SELECT * FROM login WHERE email = '" + email + "'"
        conn.query(sql).then(result => {
            if (!result.length) {
                res.status(201).send("0")
                console.log("Email: " + email + " is not duplicate.")
            } else {
                res.status(201).send("1")
                console.log("Email: " + email + " is duplicate.")
            }
            conn.end();
        }).catch(err => {
            res.status(502).send("Can't complete your request righnow, try again later.")
        })
    })
}