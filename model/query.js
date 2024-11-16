const pool = require("./pool");
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
    log: ['info', 'warn', 'error'],
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

async function queryLessons(id) {
    const res = await prisma.lessons.findMany({
        where:{
            teacher_id: id,
        },
        include: {
            subjects: true,
        },
    })
    return res;
}

async function queryLesson(teacher_id, id) {
    const res = await prisma.lessons.findFirst({
        where:{
            teacher_id:teacher_id,
            lesson_id:id
        },
        include: {
            subjects:true
        }
    })
    return res;
}

async function insertSubject(args) {
    const subject = await prisma.subjects.create({data:args});
}

async function insertUser(args) {
    const user = await prisma.teachers.create({data:args});
    console.log(user);
}

async function insertLesson(args) {
    console.log(args);
    const lesson = await prisma.lessons.create({data:args});
    console.log(lesson);
}

module.exports = {
    insertUser,
    queryLesson,
    querySubject,
    querySubjects,
    insertSubject,
    insertLesson,
    queryUser,
    queryUserId,
    queryLessons
}