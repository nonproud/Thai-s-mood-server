const connectionString = process.env.DATABASE_URL
const { Pool, Client } = require('pg')
const pool = new Pool({
    connectionString: connectionString
})
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
        verifyPassword = generateVerifypassword()
        email = req.body.email
        username = req.body.username
        password = req.body.password
        values = "'" + username + "', '" + email + "', '" + password + "', '" + verifyPassword + "', " + "0";
        sql = "INSERT INTO login (username, email, password, otp, is_verified) VALUES (" + values + ");"
        console.log(sql);
        pool.query(sql).then((result) => {
            mail_sender.sendValidateMail(email, verifyPassword)
            res.status(201).send(username)
            // pool.end()

        }).catch(err => {
            console.log(err)
            res.status(502).send("Cant create user profile now, Try again later.")
            // pool.end()
        })
}

function createAccountProfile(req, res) {
    type = req.body.type
    sql_insert = ""
    username = req.body.username
    sql_update_usertpye_in_login_table = "UPDATE login SET type = '" + type +
        "' WHERE username = '" + username + "';"

    console.log("SQL: " + sql_update_usertpye_in_login_table)

    pool.query(sql_update_usertpye_in_login_table)
    // pool.end()

    if (type === "g") {
        nickname = req.body.nickname
        emergency_contact = req.body.emergency_contact
        dob = req.body.dob
        is_caffeine_addict = req.body.is_caffeine_addict
        is_drug_addict = req.body.is_drug_addict

        sql_insert = "INSERT INTO user_profile_general" +
            "(username, nickname, emergency_contact, dob, is_caffeine, is_drug_addict, created, last_modified) VALUES (" +
            "'" + username + "', '" + nickname + "', '" + emergency_contact + "', '" + dob + "', '" + is_caffeine_addict + "', '" + is_drug_addict + "', " +
            "now(), now());"

    } else if (type === "p") {
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
            "'" + username + "', '" + nickname + "', '" + emergency_contact + "', '" + dob + "', '" + sex + "', '" + is_pregnant + "', " + weight + ", " +
            height + ", " + bmi + ", '" + is_caffeine_addict + "', '" + is_drug_addict + "', '" + d1 + "', " +
            d2 + "', '" + d3 + "', '" + d4 + "', '" + d5 + "', '" + d6 + "', now(), now());"
    } else {
        res.status(404).send("Error! your user's type is wrong.")
    }

    console.log("SQL: " + sql_insert)
    pool.query(sql_insert).then(result => {
        console.log(result)
        res.status(201).send("1")
        // pool.end()
    }).catch(err => {
        console.log(err)
        res.status(502).send("0")
        // pool.end()
    })
}

function getAccountProfile(req, res) {
    type = req.query.type
    username = req.query.username
    console.log("type: " + type + " username: " + username)
    sql_select = ""

    if (type == "g") {
        sql_select = "SELECT * FROM user_profile_general WHERE username = '" + username + "';"
    } else if (type == "p") {
        sql_select = "SELECT * FROM user_profile_patient WHERE username = '" + username + "';"
    } else {
        res.status(201).send("0")
    }
    pool.query(sql_select).then((result) => {
        res.status(201).send(result[0])
        // pool.end()
    }).catch(err => {
        res.status(502).send("Cant get user profile now, Try again later.")
        // pool.end()
    })
}

function updateLoginDetails(req, res) {
    var username = req.body.username
    var email = req.body.email
    var passwd = req.body.password
    var status = false

    if (email != "NULL") {
        newVerifypassword = generateVerifypassword()
        sql = "UPDATE login SET email = '" + email + "', otp = '" + newVerifypassword + "' WHERE username = '" + username + "'"
        pool.query(sql).then((result) => {
            mail_sender.sendValidateMail(email, newVerifypassword)
            stauts = true
            // pool.end()
        }).catch(err => {
            stauts = false

            // pool.end()
        })
    } else if (passwd != "NULL") {
        sql = "UPDATE login set password = '" + password + "' WHERE username = '" + username + "';"
        pool.query(sql).then(result => {
            stauts = true
            // pool.end()
        }).catch(err => {
            stauts = false
            // pool.end()
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
        "') AND password = '" + password + "';"
    pool.query(sql).then((result) => {

        if (result[0] === undefined) {
            res.status(201).send("0")
        } else {
            console.log(username + ":" + email + " login successfully at " + new Date())
            jwt_module.getAndSentToken(result[0].username, result[0].email, result[0].is_verified, result[0].type, res)
        }
        // pool.end()
    }).catch(err => {
        console.log(err)
        res.status(502).send("Cant login now, Try again later.")
    })

}

function verifyEmail(req, res) {
    var email = req.body.email
    var verifyPassword = req.body.verifyPassword
    var sql = "SELECT * FROM login WHERE email = '" + email + "' AND otp = '" + verifyPassword + "'"
    console.log(sql)
    pool.query(sql).then((result) => {
        console.log(result)
        if (result.rowCount <= 0) {
            console.log("Email: " + email + " verify status: failed")
            res.status(201).send("0")
            // pool.end()
        } else {
            console.log("Email " + email + " verify status: success")
            res.status(201).send("1")


            var sql2 = "UPDATE login SET is_verified = 1 WHERE email = '" + email + "'"
            pool.query(sql2).then(result => {
                console.log("Email: " + email + " change verify status: success")
                // pool.end()
            }).catch(err => {
                console.log("Email: " + email + " change verify status: failed")
                // pool.end()
            })

            // pool.end()
        }

    }).catch(err => {
        res.status(502).send("Can't verify Email NOW!")
    })
    // pool.end()


}

function getTempPassword(req, res) {
    username = req.body.username
    otp = generateTempPassword()
    sql = "UPDATE login SET otp = '" + otp + "' WHERE username = '" + username + "';"
    pool.query(sql).then(result => {
        res.status(201).send(otp)
        // pool.end()
    }).catch(err => {
        res.status(502).send("Can't done your request.")
        // pool.end()
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

    var sql = "UPDATE login SET email = '" + email + "', verify_password = '" + newVerifyPasswword + "' WHERE username = '" + username + "'"
    pool.query(sql).then((result) => {
        mail_sender.sendValidateMail(email, newVerifyPasswword)
        res.status(201).send("Successfully.")
    }).catch(err => {
        res.status(502).send("Failed")
    })
    // pool.end()

}

function checkIsEmailDuplicate(req, res) {
    var email = req.body.email
    var sql = "SELECT * FROM login WHERE email = '" + email + "'"
    pool.query(sql).then(result => {
        if (!result.length) {
            res.status(201).send("0")
            console.log("Email: " + email + " is not duplicate.")
        } else {
            res.status(201).send("1")
            console.log("Email: " + email + " is duplicate.")
        }
        // pool.end()
    }).catch(err => {
        res.status(502).send("Can't complete your request righnow, try again later.")
    })
    // pool.end()

}

function checkIsUsernameDuplicate(req, res) {
    username = req.body.username
    var sql = "SELECT * FROM login WHERE username = '" + username + "'"
    pool.query(sql).then(result => {
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
    // pool.end()
}
