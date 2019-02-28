var MongoClient = require('mongodb').MongoClient

module.exports = {
    connectMemer: function () {
        return connectdb('member_login')
    },

    connectMemberDetails: function () {
        return connectdb('member_details')
    },

    connectRecord: function () {
        return connectdb('record')
    }
}

function connectdb (collection){
    var cn = MongoClient.connect('mongodb://localhost:27017/ThaisMood', { useNewUrlParser: true }, function (err, db) {
            if (err) throw err

            db.collection(collection).find().toArray(function (err, result) {
                if (err) throw err

                console.log(result)
            })
        })
    return cn;
}

