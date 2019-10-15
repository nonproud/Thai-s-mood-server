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

function getMood(req, res){
    username = req.body.username
    sql = "SELECT mood, level, date FROM mood WHERE username = '" + username + "';" 
    console.log(sql)
    pool.getConnection().then(conn => {
        conn.query(sql).then(result => {
            res.status(201).send(result)
            conn.end()
        }).catch(err => {
            res.status(502).send("err")
            console.log(err)
            conn.end()
        })
    })
    
}

function createMood(req, res){
    values = "'" + req.body.username +"', " + req.body.mood + ", " + req.body.level + ", '" + req.body.date + "'" 
    sql_insert_mood_record = "INSERT INTO mood (username, mood, level, date) VALUES (" + values +");"
    console.log(sql_insert_mood_record)
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
    sql_update_mood_record = "UPDATE mood SET mood = " + req.body.mood + ", level = " + req.body.level + 
    " WHERE username = '" + req.body.username + "' AND date = '" + req.body.date + "';"
    console.log(sql_update_mood_record)
    pool.getConnection().then(conn =>{
        conn.query(sql_update_mood_record).then(result => {
            res.status(201).send("1")
            conn.end()
        }).catch(err => {
            console.log(err)
            res.status(502).send(err)
            conn.end()
        })
    })
}

function deleteMood(req, res){
    sql_delete_mood = "DELETE FROM mood WHERE username = '" + req.body.username + "' AND date = '" + req.body.date + "';"
    console.log(sql_delete_mood)
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
    username = req.body.username
    sql = "SELECT total_time, start_time, end_time, date FROM sleep WHERE username = '" + username + "';" 
    console.log(sql)
    pool.getConnection().then(conn => {
        conn.query(sql).then(result => {
            res.status(201).send(result)
            conn.end()
        }).catch(err => {
            res.status(502).send("err")
            console.log(err)
            conn.end()
        })
    })
}

function createSleep(req, res){
    values = "'" + req.body.username +"', " + req.body.total + ", '" + req.body.start + "', '" + req.body.end + "', '" +
    req.body.date + "'" 
    sql_insert_sleep_record = "INSERT INTO sleep (username, total_time, start_time, end_time, date) VALUES (" + values +");"
    console.log(sql_insert_sleep_record)
    pool.getConnection().then(conn => {
        conn.query(sql_insert_sleep_record).then(result => {
            res.status(201).send("1")
            conn.end()
        }).catch(err => {
            res.status(502).send("err")
            console.log(err)
            conn.end()
        })
    })
}

function editSleep(req, res){
    sql_update_sleep_record = "UPDATE sleep SET total = " + req.body.total + "', start_time = '" + req.body.start + 
    "', " + req.values.start + "', end_time = '" + req.body.end + "' WHERE username = '" 
    + req.body.username + "' AND date = '" + req.body.date + "';"
    console.log(sql_update_sleep_record)
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
    console.log(sql_delete_sleep)
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
    username = req.body.username
    sql = "SELECT title, story, date FROM sleep WHERE username = '" + username + "';" 
    console.log(sql)
    pool.getConnection().then(conn => {
        conn.query(sql).then(result => {
            res.status(201).send(result)
            conn.end()
        }).catch(err => {
            res.status(502).send("err")
            console.log(err)
            conn.end()
        })
    })
}

function createDiary(req, res){
    values = "'" + req.body.username +"', '" + req.body.title + "', '" + req.body.story + "', '" + req.body.date + "'"
    sql_insert_diary_record = "INSERT INTO diary (username, title, story, date) VALUES (" + values +");"
    console.log(sql_insert_diary_record)
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
    sql_update_diary_record = "UPDATE diary SET title = '" + req.body.title + "', story = '" + req.body.story + 
    "'  WHERE username = '" + req.body.username + "' AND date = '" + req.body.date + "';"
    console.log(sql_update_diary_record)
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
    console.log(sql_delete_diary)
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

/* End of Diary Function */