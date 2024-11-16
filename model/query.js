const pool = require("./pool");
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
    log: ['info', 'warn', 'error'],
})

const Subject = () => {

    const queryId = async (id) => {
        const result = await prisma.subjects.findUnique({
            where: {
                subject_id: +id,
            }
        });
        return result;
    }
    const queryAll = async (id) => {
        const res = await prisma.subjects.findMany({
            where: {
                teacher_id:id,
            },
        });
        return res;
        
    }
    const insert = async (args) => {
        const subject = await prisma.subjects.create({data:args});
        return subject
    }

    return {
        queryId,
        queryAll,
        insert,
    }
}

const Lesson = () => {
    const queryAll = async (id) => {
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
    
    const queryId = async (teacher_id, id) => {
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
    
    const insert = async (args) => {
        console.log(args);
        const lesson = await prisma.lessons.create({data:args});
        console.log(lesson);
    }

    return {
        queryAll,
        queryId,
        insert
    }
}


const User = () => {
    
    const insert = async (args) => {
        const user = await prisma.teachers.create({data:args});
        console.log(user);
    }   

    const queryEmail = async (email) => {
        const result = await prisma.teachers.findUnique({
            where: {
                email: email,
            }
        });
        return result;
    }

    const queryId = async (id) => {
        const result = await prisma.teachers.findUnique({
            where: {
                teacher_id: id,
            },
        });
        return result;
    }

    return {
        insert,
        queryEmail,
        queryId,
    }

}

module.exports = {
    Subject,
    Lesson,
    User,
}