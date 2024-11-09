const pool = require("./pool");

async function insertUser(firstName, lastName, email, password) {
    try {
        await pool.query("INSERT INTO teachers (firstname, lastname, email, password) VALUES ($1, $2, $3, $4)",
            [firstName,lastName,email,password]
        )
    } catch (e) {
        console.log(e)
    }
}

async function querySubject(id) {
    try {
        await pool.query("SELECT * FROM subjects WHERE subject_id = $1", [id]);
    } catch (e) {
        console.log(e);
    }
}

async function querySubjects() {
    try {
        await pool.query("SELECT * FROM subjects");
    } catch (e) {
        console.log(e);
    }
}

async function insertSubject(name, textbook, description, teacher_id) {
    try {
        await pool.query("INSERT INTO subjects (name, textbook, description, teacher_id) VALUES ($1, $2, $3, $4)",
            [name,textbook,description,teacher_id]
        )
    } catch (e) {
        console.log(e);
    }
}

module.exports = {
    insertUser,
    querySubject,
    querySubjects,
    insertSubject,
}