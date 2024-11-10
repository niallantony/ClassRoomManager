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

async function querySingle(table, column, search) {
    const rows = await queryAll(table, column, search);
    return rows[0]
}

async function queryAll(table, column, search) {
    try {
        const sql = `SELECT * FROM ${table} WHERE ${column} = $1`;
        const { rows } = await pool.query(sql, [search]);
        return rows;
    } catch (e) {
        console.log(e);
    }
        
}

async function queryUser(email) {
    try {
        const res = await querySingle("teachers", "email", email);
        return res;
    } catch (e) {
        console.log(e);
    }
}

async function queryUserId(id) {
    try {
        const res = await querySingle("teachers", "teacher_id", id);
        return res;
    } catch (e) {
        console.log(e);
    }
}

async function querySubject(id) {
    try {
        const res = await querySingle("subjects","subject_id",id)
        return res;
    } catch (e) {
        console.log(e);
    }
}

async function querySubjects(id) {
    const res = await queryAll("subjects", "teacher_id", id);
    return res
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