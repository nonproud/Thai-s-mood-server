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
const jwt_module = require("./jwt-module")


const expressSchema = require('express-schema'),
    schemas = expressSchema.schemas,
    Schema = expressSchema.Schema;

const bcrypt = require('bcrypt')
const saltRounds = 15
const mail_sender = require('./mail-sender')

module.exports = {
    getSecret: getSecret,
    authLogin: authLogin,
    createAccount: createAccount,
    getNewVerifyPassword: getNewVerifyPassword,
    createAccountProfile: createAccountProfile,
    getAccountProfile: getAccountProfile,
    updateLoginDetails: updateLoginDetails,
    verifyEmail: verifyEmail,
    checkIsEmailDuplicate: checkIsEmailDuplicate,
    checkIsUsernameDuplicate: checkIsUsernameDuplicate

}

function createAccount(req, res) {
    pool.getConnection().then(conn => {
        verifyPassword = generateVerifypassword()
        email = req.body.email
        username = req.body.username
        password = req.body.password
        values = "'" + username + "', '" + email + "', SHA2('" + password + "', 256), '" + verifyPassword + "', " + 0;
        conn.query("INSERT INTO login (username, email, password, verify_password, is_verified) VALUES (" + values + ");").then((result) => {
            mail_sender.sendValidateMail(email, verifyPassword)
            res.status(201).send(username)
            
        }).catch(err => {
            console.log(err)
            res.status(502).send("Cant create user profile now, Try again later.")
        })
        conn.end()
    })
}

function createAccountProfile(req, res) {
    type = req.body.type
    sql_insert = ""

    sql_update_usertpye_in_login_table = "UPDATE login SET type = '" + type + "';"

    pool.getConnection().then(conn => {
        conn.query(sql_update_usertpye_in_login_table)
        conn.end()
    })

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
        }).catch(err =>{
            console.log(err)
            res.status(502).send("0")
        })
        conn.end()
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
            
        }).catch(err => {
            res.status(502).send("Cant get user profile now, Try again later.")
        })
        conn.end()
    })
}

function updateLoginDetails(req, res) {
    var username = req.body.username
    var email = req.body.email
    var passwd = req.body.password
    var status = false

    if (email != "NULL") {
        var newVerifypassword = generateVerifypassword()
        pool.getConnection().then(conn => {
            var sql = "UPDATE login SET email = '" + email + "', verify_password = '" + newVerifypassword + "' WHERE username = '" + username + "'"
            conn.query(sql).then((result) => {
                mail_sender.sendValidateMail(email, newVerifypassword)
                stauts = true
            }).catch(err => {
                stauts = false
            })
            conn.end()
        })

    } else if (passwd != "NULL") {
        
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
                    jwt_module.getAndSentToken(result[0].username, result[0].email, result[0].is_verified, res)
                }
                conn.end()
            }).catch(err => {
                console.log(err)
                res.status(502).send("Cant login now, Try again later.")
            })
    })
}

function verifyEmail(req, res) {
    var email = req.body.email
    var verifyPassword = req.body.verifyPassword
    pool.getConnection().then(conn => {
        var sql = "SELECT * FROM login WHERE email = '" + email + "' AND verify_password = '" + verifyPassword + "'"
        conn.query(sql).then((result) => {
            if (!result.length) {
                console.log("Email: " + email + " verify status: failed")
                res.status(201).send("0")
                conn.end()
            } else {
                console.log("Email " + email + " verify status: success")

                
                jwt_module.getAndSentToken(result[0].username, result[0].email, 1, res)

                pool.getConnection().then(conn => {
                    var sql2 = "UPDATE login SET is_verified = 1 WHERE email = '" + email + "'"
                    conn.query(sql2).then(result => {
                        console.log("Email: " + email + " change verify status: success")
                        conn.end()
                    }).catch(err => {
                        console.log("Email: " + email + " change verify status: failed")
                    })
                })
                conn.end()
            }

        }).catch(err => {
            res.status(502).send("Can't verify Email NOW!")
        })
        conn.end()
    })


}

function generateVerifypassword() {
    var password = "";
    var possible = "0123456789";

    for (var i = 0; i < 4; i++)
        password += possible.charAt(Math.floor(Math.random() * possible.length));

    return password;
}

function getNewVerifyPassword(req, res) {
    var newVerifyPasswword = generateVerifypassword()
    var username = req.body.username
    var email = req.body.email
    pool.getConnection().then(conn => {
        var sql = "UPDATE login SET email = '" + email + "', verify_password = '" + newVerifyPasswword + "' WHERE username = '" + username + "'"
        conn.query(sql).then((result) => {
            mail_sender.sendValidateMail(email, newVerifyPasswword)
            res.status(201).send("Successfully.")
        }).catch(err => {
            res.status(502).send("Failed")
        })
        conn.end()
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
        conn.end()
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
            
        }).catch(err => {
            res.status(502).send("Can't complete your request righnow, try again later.")
        })
        conn.end()
    })
}