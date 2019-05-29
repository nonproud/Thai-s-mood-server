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

const expressSchema = require('express-schema'),
    schemas = expressSchema.schemas,
    Schema = expressSchema.Schema;
// var payloadschema = new Schema({
//     id: schemas.string.length(20, 20).require(), // foo should between 3~5, and not undefined.
//     emai: schemas.string.length(0, 100).require(),
//     is_verified: schemas.required(),
//     iat: schemas.string.required() 
//     });
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
    checkIsEmailDuplicate: checkIsEmailDuplicate,
    checkIsUsernameDuplicate: checkIsUsernameDuplicate

}

function createAccount(req, res) {
    pool.getConnection().then(conn => {
        otp = generateOTP()
        email = req.body.email
        username = req.body.username
        password = req.body.password
        values = "'" + username + "', '" + email + "', SHA2('" + password + "', 256), '" + otp + "', " + 0;
        conn.query("INSERT INTO login (username, email, password, otp, is_verified) VALUES (" + values + ");").then((result) => {
            mail_sender.sendValidateMail(email, otp)
            res.status(201).send(username)
            conn.end()
        }).catch(err => {
            console.log(err)
            res.status(502).send("Cant create user profile now, Try again later.")
            conn.end()
        })
    })
}

function createAccountProfile(req, res) {
    type = req.body.type
    sql_insert = ""
    if(type == "g"){
        username = req.body.username
        dob = req.body.dob
        is_caffeine_addict = req.body.is_caffeine_addict
        is_drug_addict = req.body.is_drug_addict
        
        sql_insert = "INSERT INTO `user_profile_general`" +
        "(`username`, `dob`, `is_caffeine`, `is_drug_addict`, `created`, `last_modified`) VALUES (" +
        "'" + username + "', '" + dob + "', " +is_caffeine_addict + ", " + is_drug_addict + ", " +
        "now(), now());"

    }else if(type == "p"){
        username = req.body.username
        sex = req.body.sex
        is_pregnant = req.body.is_pregnant
        dob = req.body.dob
        weight = req.body.weight
        height = req.body.height
        bmi = req.body.bmi
        is_caffeine_addict = req.body.is_caffeine_addict
        is_drug_addict = req.body.is_drug_addict
        disease = req.body.disease
        sql_insert = "INSERT INTO `user_profile_patient`" +   
        "(`username`, `sex`, `is_pregnant`, `dob`, `weight`, `height`, `bmi`, `is_caffeine`, `is_drug_addict`, `disease`, `created`, `last_modified`)" +
        "VALUES (" +
        "'" + username + "', '" + sex + "', " + is_pregnant + ", '"+ dob + "', " + weight + ", " +
        height + ", " + bmi + ", " + is_caffeine_addict + ", " + is_drug_addict + ", '" + disease + "', now(), now());"
    }else{
        res.status(404).send("Error! your user's type is wrong.")
    }

    pool.getConnection().then(conn =>{
        conn.query(sql_insert).then(result => {
            console.log(result)
            res.status(201).send("1")
            conn.end()
        }).catch(err =>{
            console.log(err)
            res.status(502).send("0")
        })
    })
}

function getAccountProfile(req, res) {
    let type = req.query.type
    let username = req.query.username
    console.log("type: " + type + " username: " + username)
    sql_select = ""

    if(type == "g"){
        sql_select = "SELECT * FROM `user_profile_general` WHERE username = '" + username + "';"
    }else if(type == "p"){
        sql_select = "SELECT * FROM `user_profile_patient` WHERE username = '" + username + "';"
    }else{
        res.status(404).send("Error! your user's type is wrong.")
    }

    pool.getConnection().then(conn => {
        conn.query(sql_select).then((result) => {
            res.status(201).send(result[0])
            conn.end()
        }).catch(err => {
            res.status(502).send("Cant get user profile now, Try again later.")
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
        username = req.body.username
        email = req.body.email
        password = req.body.password
        conn.query("SELECT * FROM login WHERE (email = '" + email + "' OR username ='" + username + 
        "') AND password = SHA2('" + password + "', 256);")
            .then((result) => {
            
                if(result[0] === undefined){
                    res.status(201).send("0")
                }else{
                    const jwt = getJWT(result[0].username, result[0].email, result[0].is_verified)
                    res.status(201).send(jwt+","+result[0].username+","+result[0].email+","+result[0].is_verified)
                }
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
                
                const jwt = getJWT(result[0].username, result[0].email, 1)

                res.status(201).send(jwt)
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

function generateOTP() {
    var otp = "";
    var possible = "0123456789";

    for (var i = 0; i < 4; i++)
        otp += possible.charAt(Math.floor(Math.random() * possible.length));

    return otp;
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

function checkIsUsernameDuplicate(req, res) {
    username = req.body.username
    pool.getConnection().then(conn => {
        var sql = "SELECT * FROM login WHERE username = '" + username + "'"
        conn.query(sql).then(result => {
            if (!result.length) {
                res.status(201).send("0")
                console.log("Username: " + username + " is not duplicate.")
            } else {
                res.status(201).send("1")
                console.log("Username: " + username + " is duplicate.")
            }
            conn.end();
        }).catch(err => {
            res.status(502).send("Can't complete your request righnow, try again later.")
        })
    })
}

function getJWT(username, email, is_verified){
    var payload = {
        username: username,
        email: email,
        is_verified: is_verified,
        iat: new Date()
    }
    return jwt.encode(payload, getSecret())
}

function getSecret() {
    return SECRET
}