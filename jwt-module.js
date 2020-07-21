const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();

const SECRET = "this is a real thai's mood server!"

module.exports = {
  verifyToken: verifyToken,
  getAndSentToken: getAndSentToken,
  verifyTokenForGetMethod: verifyTokenForGetMethod
}

function verifyToken(req, res, next) {

  const bearerHeader = req.headers['authorization'];

  if(typeof bearerHeader !== 'undefined') {

    jwt.verify(bearerHeader, getSecret(), (err, authData) => {
      if(err) {
        res.sendStatus(403);
      } else {
        if(authData.username == req.body.username){
          next();
        }else{
          res.sendStatus(403);
        }
      }
    });
  } else {
    // Forbidden
    res.sendStatus(403);
  }

}

function verifyTokenForGetMethod(req, res, next) {

  const bearerHeader = req.headers['authorization'];

  if(typeof bearerHeader !== 'undefined') {

    jwt.verify(bearerHeader, getSecret(), (err, authData) => {
      if(err) {
        res.sendStatus(403);
      } else {
        next();
      }
    });
  } else {
    // Forbidden
    res.sendStatus(403);
  }

}

function getAndSentToken(username, email, is_verified, res){

  const user = {
    username: username,
    email: email,
    is_verified : is_verified
  }

  jwt.sign(user, getSecret(),  (err, token) => {
    res.json({
      token,
      "username": username,
      "email": email,
      "is_verified": is_verified,
    });
  });

}

function getSecret(){
  return SECRET
}

















// const express = require("express");
// const app = express();
// const bodyParser = require("body-parser");
// app.use(bodyParser.json());
// const jwt = require("jwt-simple");
// const passport = require("passport");
// const ExtractJwt = require("passport-jwt").ExtractJwt;
// const JwtStrategy = require("passport-jwt").Strategy;
// const SECRET = "this is a real thai's mood server!";
// const mariadb = require('mariadb');
// const requireJWTAuth = passport.authenticate("jwt");
// const pool = mariadb.createPool({
//     host: 'localhost',
//     port: 3306,
//     user: 'api',
//     password: 'password',
//     database: 'thaismood',
//     connectionLimit: 5
// });


// module.exports = {
//     jwtAuthen: jwtAuthen,
//     requireJWTAuth: requireJWTAuth
// }

// function jwtAuthen(req, res) {

//     const jwtOptions = {
//         jwtFromRequest: ExtractJwt.fromHeader("authorization"),
//         secretOrKey: SECRET
//     };

//     username = req.body.username
//     usernameCheck = false
//     pool.getConnection().then(conn => {
//         var sql = "SELECT * FROM login WHERE username = '" + username + "'"
//         conn.query(sql).then(result => {
//             if (!result.length) {
//                 usernameCheck = false
//                 console.log("Username: " + username + " is not matched.")
//             } else {
//                 usernameCheck = true
//                 console.log("Username: " + username + " is matched.")
//             }

//         }).catch(err => {
//             res.status(502).send("Can't complete your request righnow, try again later.")
//         })
//         conn.end()
//     })


//     const jwtAuth = new JwtStrategy(jwtOptions, (payload, done) => {
//         if (usernameCheck === true) done(null, true);
//         else done(null, false);
//     });

//     passport.use(jwtAuth);

//     requireJWTAuth = passport.authenticate("jwt", { session: false });

//     res.send(true);


// }
