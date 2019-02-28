var MongoClient = require('mongodb').MongoClient

module.exports = {
    insertNewMember: function (req) {
        MongoClient.connect('mongodb://localhost:27017/ThaisMood', { useNewUrlParser: true }, function (err, db) {
            if (err) {
                console.log(err)
                return false
            } else {
                db.collection(collection).find().insert(req.body, function (err, result) {
                    if (err) throw err
                    console.log(result)
                    return true;
                })
            }            
        })
    },

    connectMemberDetails: function () {
        // return connectdb('member_details')
    },

    connectRecord: function () {
        // return connectdb('record')
    }
}



