const pool = require("./pool");
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
})

async function queryUser(email) {
    const result = await prisma.teachers.findUnique({
        where: {
            email: email,
        }
    });
    return result;
}

async function queryUserId(id) {
    const result = await prisma.teachers.findUnique({
        where: {
            teacher_id: id,
        },
    });
    return result;
}

async function querySubject(id) {
    const result = await prisma.subjects.findUnique({
        where: {
            subject_id: +id,
        }
    });
    return result;
}

async function querySubjects(id) {
    const res = await prisma.subjects.findMany({
        where: {
            teacher_id:id,
        },
    });
    return res;
}

async function insertSubject(args) {
    const subject = await prisma.subjects.create({data:args});
}

async function insertUser(args) {
    const user = await prisma.teachers.create({data:args});
    console.log(user);
}

module.exports = {
    insertUser,
    querySubject,
    querySubjects,
    insertSubject,
    queryUser,
    queryUserId,
}