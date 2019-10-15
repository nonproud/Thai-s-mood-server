const nodemailer = require('nodemailer')
const database = require('./database-utilities-module')
/* Gmail config */
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'thaismood.validate@gmail.com', // your email
        pass: database.getEmailPassword // your email password
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
        // console.log("Email: " + email + " | code: " + confirm_code)
    }
}