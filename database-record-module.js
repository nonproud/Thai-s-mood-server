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
const jwt = require("jwt-simple")

const SECRET = "this is a real thai's mood server!"

module.exports = {

    getMood: getMood,
    createMood: createMood,
    editMood: editMood,
    deleteMood: deleteMood,

    getSleep: getSleep,
    createSleep: createSleep,
    editSleep: editSleep,
    deleteSleep: deleteSleep,

    getDiary: getDiary,
    createDiary: createDiary,
    editDiary: editDiary,
    deleteDiary: deleteDiary

}

/* Mood Function */

function getMood(username, mood, level, date){
    
    
}

function createMood(req, res){
    values = "'" + req.body.username +"', " + reg.body.mood + ", " + req.body.level + ", '" + req.body.date + "'" 
    sql_insert_mood_record = "INSERT INTO mood (username, mood, level, date) VALUES (" + values +"');"
    pool.getConnection().then(conn => {
        conn.query(sql_insert_mood_record).then(result => {
            res.status(201).send("1")
            conn.end()
        }).catch(err => {
            res.status(502).send("err")
            conn.end()
        })

    })
}

function editMood(req, res){
    sql_update_mood_record = "UPDATE mood SET mood = " + req.body.mood + "', level = " + req.body.level + 
    " WHERE username = '" + req.username + "' AND date = '" + date + "';"
    pool.getConnection().then(conn =>{
        conn.query(sql_update_mood_record).then(result => {
            res.status(201).send("1")
            conn.end()
        }).catch(err => {
            res.status(502).send("err")
            conn.end()
        })
    })
}

function deleteMood(req, res){
    sql_delete_mood = "DELETE FROM mood WHERE username = '" + req.body.username + "' AND date = '" + req.body.date + "';"
    pool.getConnection().then(conn =>{
        conn.query(sql_delete_mood).then(result => {
            res.status(201).send("1")
            conn.end()
        }).catch(err => {
            res.status(502).send("err")
            conn.end()
        })
    })
}

/* End of Mood Function */

/* Sleep Function */

function getSleep(req, res){
    
}

function createSleep(req, res){
    values = "'" + req.body.username +"', " + reg.body.total + ", '" + req.body.start + "', '" + req.body.end + "', '" +
    req.body.date + "'" 
    sql_insert_sleep_record = "INSERT INTO mood (username, total_time, start_time, end_time, date) VALUES (" + values +"');"
    pool.getConnection().then(conn => {
        conn.query(sql_insert_sleep_record).then(result => {
            res.status(201).send("1")
            conn.end()
        }).catch(err => {
            res.status(502).send("err")
            conn.end()
        })
    })
}

function editSleep(req, res){
    sql_update_sleep_record = "UPDATE sleep SET total = " + req.body.total + "', start_time = '" + req.body.start + 
    "', " + req.values.start + "', end_time = '" + req.body.end + "' WHERE username = '" 
    + req.username + "' AND date = '" + date + "';"
    pool.getConnection().then(conn =>{
        conn.query(sql_update_sleep_record).then(result => {
            res.status(201).send("1")
            conn.end()
        }).catch(err => {
            res.status(502).send("err")
            conn.end()
        })
    })
}

function deleteSleep(req, res){
    sql_delete_sleep = "DELETE FROM sleep WHERE username = '" + req.body.username + "' AND date = '" + req.body.date + "';"
    pool.getConnection().then(conn =>{
        conn.query(sql_delete_mood).then(result => {
            res.status(201).send("1")
            conn.end()
        }).catch(err => {
            res.status(502).send("err")
            conn.end()
        })
    })
}

/* End of Sleep Function */

/* Diary Function */

function getDiary(req, res){
    
}

function createDiary(req, res){
    values = "'" + req.body.username +"', '" + reg.body.title + "', '" + req.body.story + "', '" + date + "'"
    sql_insert_diary_record = "INSERT INTO mood (username, title, story, date) VALUES (" + values +"');"
    pool.getConnection().then(conn => {
        conn.query(sql_insert_diary_record).then(result => {
            res.status(201).send("1")
            conn.end()
        }).catch(err => {
            res.status(502).send("err")
            conn.end()
        })
    })
}

function editDiary(req, res){
    sql_update_diary_record = "UPDATE diary SET title = '" + req.body.titlel + "', story = '" + req.body.story + 
    "'  WHERE username = '" + req.username + "' AND date = '" + date + "';"
    pool.getConnection().then(conn =>{
        conn.query(sql_update_diary_record).then(result => {
            res.status(201).send("1")
            conn.end()
        }).catch(err => {
            res.status(502).send("err")
            conn.end()
        })
        
    })

}

function deleteDiary(req, res){
    sql_delete_diary = "DELETE FROM diary WHERE username = '" + req.body.username + "' AND date = '" + req.body.date + "';"
    pool.getConnection().then(conn =>{
        conn.query(sql_delete_mood).then(result => {
            res.status(201).send("1")
        }).catch(err => {
            res.status(502).send("err")
        })
        conn.end()
    })
}

/* End of Diary Function */