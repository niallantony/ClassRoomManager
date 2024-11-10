const pool = require("./pool");

function makeInsertString(table, args) {
    let sql = `INSERT INTO ${table} (`
    for (const key in args) {
        sql += `${key}`;
        if (key !== Object.keys(args)[Object.keys(args).length - 1]) {
            sql += ',';
        }
    }
    sql += ') VALUES (';
    for (let i = 1; i <= Object.keys(args).length; i++) {
        sql += ` \$${i}`
        if (i !== Object.keys(args).length) {
            sql += ',';
        }
    }
    sql += ')'
    return sql;
}

async function insertToDB(table, args) {
    const sql = makeInsertString(table, args);
    try {
        await pool.query(sql, Object.values(args));
    } catch(e) {
        console.log(e)
    }
}

async function queryUser(email) {
    try {
        const {rows} = await pool.query("SELECT * FROM teachers WHERE email = $1", [email]);
        return rows[0];
    } catch (e) {
        console.log(e);
    }
}

async function queryUserId(id) {
    try {
        const {rows } = await pool.query("SELECT * FROM teachers WHERE teacher_id = $1", [id]);
        return rows[0]
    } catch (e) {
        console.log(e);
    }
}

async function querySubject(id) {
    try {
        const {rows} = await pool.query("SELECT * FROM subjects WHERE subject_id = $1", [id]);
        return rows[0];
    } catch (e) {
        console.log(e);
    }
}

async function querySubjects(id) {
    const res = await pool.query("SELECT * FROM subjects WHERE teacher_id = $1", [id]);
    return res.rows
}

function insertSubject(args) {
    insertToDB("subjects", args);
}

function insertUser(args) {
    insertToDB("teachers", args);
}

module.exports = {
    insertUser,
    querySubject,
    querySubjects,
    insertSubject,
    queryUser,
    queryUserId,
}