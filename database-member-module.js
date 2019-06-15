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
const jwt_module = require("./jwt-module")


const expressSchema = require('express-schema'),
    schemas = expressSchema.schemas,
    Schema = expressSchema.Schema;

const mail_sender = require('./mail-sender')

module.exports = {
    authLogin: authLogin,
    createAccount: createAccount,
    getNewVerifyPassword: getNewVerifyPassword,
    createAccountProfile: createAccountProfile,
    getAccountProfile: getAccountProfile,
    updateLoginDetails: updateLoginDetails,
    verifyEmail: verifyEmail,
    checkIsEmailDuplicate: checkIsEmailDuplicate,
    checkIsUsernameDuplicate: checkIsUsernameDuplicate,
    getTempPassword: getTempPassword

}

function createAccount(req, res) {
    pool.getConnection().then(conn => {
        verifyPassword = generateVerifypassword()
        email = req.body.email
        username = req.body.username
        password = req.body.password
        values = "'" + username + "', '" + email + "', SHA2('" + password + "', 256), '" + verifyPassword + "', " + 0;
        sql = "INSERT INTO login (username, email, password, verify_password, is_verified) VALUES (" + values + ");"
        conn.query(sql).then((result) => {
            mail_sender.sendValidateMail(email, verifyPassword)
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
    username = req.body.username
    sql_update_usertpye_in_login_table = "UPDATE login SET type = '" + type +
     "' WHERE username = '" + username + "';"

    pool.getConnection().then(conn => {
        conn.query(sql_update_usertpye_in_login_table)
        conn.end()
    })

    if(type === "g"){
        nickname = req.body.nickname
        emergency_contact = req.body.emergency_contact
        dob = req.body.dob
        is_caffeine_addict = req.body.is_caffeine_addict
        is_drug_addict = req.body.is_drug_addict
        
        sql_insert = "INSERT INTO user_profile_general" +
        "(username, nickname, emergency_contact, dob, is_caffeine, is_drug_addict, created, last_modified) VALUES (" +
        "'" + username + "', '" + nickname + "', '" + emergency_contact + "', '"+ dob + "', " + is_caffeine_addict + ", " + is_drug_addict + ", " +
        "now(), now());"

    }else if(type === "p"){
        nickname = req.body.nickname
        emergency_contact = req.body.emergency_contact
        sex = req.body.sex
        is_pregnant = req.body.is_pregnant
        dob = req.body.dob
        weight = req.body.weight
        height = req.body.height
        bmi = req.body.bmi
        is_caffeine_addict = req.body.is_caffeine_addict
        is_drug_addict = req.body.is_drug_addict
        d1 = req.body.d1
        d2 = req.body.d2
        d3 = req.body.d3
        d4 = req.body.d4
        d5 = req.body.d5
        d6 = req.body.d6
        sql_insert = "INSERT INTO user_profile_patient" +   
        "(username, nickname, emergency_contact, dob, sex, is_pregnant, weight, height, bmi, is_caffeine, is_drug_addict, d1, d2, d3, d4, d5, d6, created, last_modified)" +
        "VALUES (" +
        "'" + username + "', '" + nickname + "', '" + emergency_contact + "', '" + dob + "', '" + sex + "', " + is_pregnant + ", " + weight + ", " +
        height + ", " + bmi + ", " + is_caffeine_addict + ", " + is_drug_addict + ", " + d1 + ", " + 
        d2 + ", " + d3 + ", " + d4 + ", " + d5 + ", '" + d6 + "', now(), now());"
    }else{
        res.status(404).send("Error! your user's type is wrong.")
    }

    console.log("SQL: " + sql)
    pool.getConnection().then(conn =>{
        conn.query(sql_insert).then(result => {
            console.log(result)
            res.status(201).send("1")
            conn.end()
        }).catch(err =>{
            console.log(err)
            res.status(502).send("0")
            conn.end()
        })
    })
}

function getAccountProfile(req, res) {
    type = req.query.type
    username = req.query.username
    console.log("type: " + type + " username: " + username)
    sql_select = ""

    if(type == "g"){
        sql_select = "SELECT * FROM user_profile_general WHERE username = '" + username + "';"
    }else if(type == "p"){
        sql_select = "SELECT * FROM user_profile_patient WHERE username = '" + username + "';"
    }else{
        res.status(404).send("Error! your user's type is wrong.")
    }

    pool.getConnection().then(conn => {
        conn.query(sql_select).then((result) => {
            res.status(201).send(result[0])
            conn.end()
        }).catch(err => {
            res.status(502).send("Cant get user profile now, Try again later.")
            conn.end()
        })
        
    })
}

function updateLoginDetails(req, res) {
    var username = req.body.username
    var email = req.body.email
    var passwd = req.body.password
    var status = false

    if (email != "NULL") {
        newVerifypassword = generateVerifypassword()
        pool.getConnection().then(conn => {
            sql = "UPDATE login SET email = '" + email + "', verify_password = '" + newVerifypassword + "' WHERE username = '" + username + "'"
            conn.query(sql).then((result) => {
                mail_sender.sendValidateMail(email, newVerifypassword)
                stauts = true
                conn.end()
            }).catch(err => {
                stauts = false

                conn.end()
            })
        })

    } else if (passwd != "NULL") {
        sql = "UPDATE login set password = SHA2('" + password + "', 256) WHERE username = '" + username + "';"
        pool.getConnection().then(conn => {
            conn.query(sql).then(result => {
                stauts = true
                conn.end()
            }).catch(err => {
                stauts = false
                conn.end()
            })
        })
    }

    if (status) {
        res.status(201).send("1.")
    } else {
        res.status(502).send("Unable to update detials, Please try again later.")
    }
}

function authLogin(req, res) { 
    username = req.body.username
    email = req.body.email
    password = req.body.password
    sql = "SELECT * FROM login WHERE (email = '" + email + "' OR username ='" + username + 
        "') AND password = SHA2('" + password + "', 256);"
    pool.getConnection().then(conn => {
        conn.query(sql).then((result) => {
    
                if(result[0] === undefined){
                    res.status(201).send("0")
                }else{
                    console.log(username + ":" + email + "login successfully at " + new Date())
                    jwt_module.getAndSentToken(result[0].username, result[0].email, result[0].is_verified, result[0].type, res)
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
                jwt_module.getAndSentToken(result[0].username, result[0].email, 1, result[0].type, res)

                pool.getConnection().then(conn2 => {
                    var sql2 = "UPDATE login SET is_verified = 1 WHERE email = '" + email + "'"
                    conn2.query(sql2).then(result => {
                        console.log("Email: " + email + " change verify status: success")
                        conn2.end()
                    }).catch(err => {
                        console.log("Email: " + email + " change verify status: failed")
                        conn2.end()
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

function getTempPassword(req, res){
    username = req.body.username
    otp = generateTempPassword()
    sql = "UPDATE login SET otp = '" + otp + "' WHERE username = '" + username + "';"
    pool.getConnection().then(conn =>{
        conn.query(sql).then(result => {
            res.status(201).send(otp)
            conn.end()
        }).catch(err => {
            res.status(502).send("Can't done your request.")
            conn.end()
        })
    })
}

function generateVerifypassword() {
    var password = "";
    var possible = "0123456789";

    for (var i = 0; i < 4; i++)
        password += possible.charAt(Math.floor(Math.random() * possible.length));

    return password;
}

function generateTempPassword() {
    var password = "";
    var possible = "0123456789";

    for (var i = 0; i < 6; i++)
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