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

module.exports = {
    insertUser,
}