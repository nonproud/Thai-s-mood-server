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

    insertNewMemberDetails: function (req, res) {
        MongoClient.connect(url, { useNewUrlParser: true }, (err, database) => {
            assert.equal(null, err)
            console.log("Ready to insert member details.")

            /* Insert new member details section */
            mydb = database.db(dbName)
            // let detailsToInsert = {
            //     "member_id": req.body.member_id,
            //     "name": req.body.name,
            //     "lastname": req.body.lname,
            //     "gender": req.body.gender,
            //     "type": req.body.type,
            //     "validation_status": true,


            // }
            mydb.collection('member_details').insertOne(insertString, (err, result) => {
                if (err)
                    res.status(500).sent("Opp! You hit 500")
                else {
                    console.log("Insert member details for ID: " + result.insertedId)
                    mail_sender.sendValidateMail(req.body.email, req.body.confirm_no)
                    res.status(201).send(result.insertedId)
                }
            })
            database.close()
            /* End of insert new member */
        });
    },

    connectRecord: function () {
        // return connectdb('record')
    }
}





