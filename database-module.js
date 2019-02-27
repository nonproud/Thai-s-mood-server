var MongoClient = require('mongodb').MongoClient

module.exports = {
    connectMemer: function () {
        MongoClient.connect('mongodb://localhost:27017/ThaisMood', function (err, db) {
            if (err) throw err

            db.collection('member_login').find().toArray(function (err, result) {
                if (err) throw err

                console.log(result)
            })
        })
    },

    connectMemberDetails: function () {
        MongoClient.connect('mongodb://localhost:27017/ThaisMood', function (err, db) {
            if (err) throw err

            db.collection('member_details').find().toArray(function (err, result) {
                if (err) throw err

                console.log(result)
            })
        })
    },

    connectRecord: function () {
        MongoClient.connect('mongodb://localhost:27017/ThaisMood', function (err, db) {
            if (err) throw err

            db.collection('record').find().toArray(function (err, result) {
                if (err) throw err

                console.log(result)
            })
        })
    }
}

