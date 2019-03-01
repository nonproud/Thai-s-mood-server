const MongoClient = require('mongodb').MongoClient
const mail_sender = require('./mail-sender')
const url = 'mongodb://localhost:27017'
const dbName = 'ThaisMood'
const assert = require('assert')
var mydb
const bcrypt = require('bcrypt')
const saltRounds = 15

module.exports = {
    insertNewMember: (req, res) => {
        MongoClient.connect(url, { useNewUrlParser: true }, (err, database) => {
            assert.equal(null, err)
            console.log("Ready to insert new member.")

            /* Insert new member section */
            mydb = database.db(dbName)
            bcrypt.genSalt(saltRounds, (err, salt) => {
                bcrypt.hash(req.body.passwd, salt, (err, hash, ) => {
                    let insertString = {
                        "email": req.body.email,
                        "passwd": hash,
                        "validate_status": req.body.v_status,
                        "confirm_no": req.body.confirm_no
                    }
                    mydb.collection('member_login').insertOne(insertString, (err, result) => {
                        if (err)
                            res.send('Error')
                        else {
                            console.log(result.insertedId)
                            console.log("Insert new member ID: " + result.insertedId)
                            mail_sender.sendValidateMail(req.body.email, req.body.confirm_no)
                            res.status(201).send(result.insertedId)
                        }
                    })
                    database.close()
                })
            })
            /* End of insert new member */
        });
    },

    connectMemberDetails: function () {
        // return connectdb('member_details')
    },

    connectRecord: function () {
        // return connectdb('record')
    }
}





