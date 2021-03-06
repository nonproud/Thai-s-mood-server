const nodemailer = require('nodemailer')
const database = require('./database-utilities-module')
/* Gmail config */
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'thaismood.validate@gmail.com',
        pass: '&z~)c?{1rN*|*q'
    }
    
});

function getValidateMail(toEmail, confirm_code) {
    let validate_mail = {
        from: 'thaismood.validate@gmail.com',
        to: toEmail,
        subject: "รหัสยืนยันสำหรับสมัครแอปพลิเคชั่น Thai's Mood",
        html: "<h1>" + confirm_code + "</h1>"
    }
    return validate_mail
}

module.exports = {
    sendValidateMail: function (email, confirm_code) {
        transporter.sendMail(getValidateMail(email, confirm_code), function (err, info) {
            if (err)
                console.log(err)
            else
                console.log(info);
        });
    }
}

function returnValue(value){
    return value
}