const { PrismaClientKnownRequestError } = require("@prisma/client/runtime/library");
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
    const queryIdWithExams = async (id) => {
        const result = await prisma.subjects.findUnique({
            where: {
                subject_id: +id,
            },
            include: {
                exams: {
                    select: {
                        exam_id:true,
                        name: true,
                        marks: true,
                        percent: true
                    }
                }
            }
        })
        return result
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

    const deleteId = async (id) => {
        try {
            const res = await prisma.subjects.delete({
                where: {
                    subject_id:+id,
                }
            })
            return res
        } catch (e) {
            if (e instanceof PrismaClientKnownRequestError) {
                if (e.code === 'P2003') {
                    throw e
                }
            }
            console.log(e)
        }
    }

    const update = async (id, args) => {
        try {
            const res = await prisma.subjects.update({
                where: {
                    subject_id: +id,
                },
                data: args
            })
            return res;
        } catch (e) {
            console.log(e);
        }
    }

    return {
        update,
        deleteId,
        queryId,
        queryIdWithExams,
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
    
    const getNames = async (id) => {
        const res = await prisma.lessons.findMany({
            where:{
                teacher_id: id,
            },
            select: {
                name:true,
                lesson_id: true,
            }
        })
        return res
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

    const deleteId = async (id) => {
        const lesson = await prisma.lessons.delete({
            where: {
                lesson_id:+id,
            }
        })
        return lesson
    }
    
    const update = async (id, args) => {
        try {
            const res = await prisma.lessons.update({
                where: {
                    lesson_id: id,
                },
                data: args
            })
            return res
        } catch (e) {
            console.log(e)
        }
    }

    return {
        getNames,
        update,
        deleteId,
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

const Exam = () => {
    const insert = async (args) => {
        console.log(args)
        const exam = await prisma.exams.create({data:args});
        return exam;
    }

    const queryId = async (id) => {
        const result = await prisma.exams.findUnique({
            where: {
                exam_id: +id,
            },
            include: {
                subjects:true,
            }
        })
        return result
    }

    const update = async (id, args) => {
        try {
            const res = await prisma.exams.update({
                where: {
                    exam_id:id,
                },
                data:args
            })
            return res
        } catch (e) {
            console.log(e)
        }
    }

    const deleteId = async (id) => {
        console.log("Delete: ",id)
        const res = await prisma.exams.delete({
            where: {
                exam_id:+id
            }
        })
        return res
    }

    return {
        update,
        insert,
        queryId,
        deleteId,
    }
}

const Student = () => {
    const insert = async (args) => {
        const res = await prisma.students.create({
            data: {
                name: args.name,
                student_id: args.student_id,
                teacher_id: args.teacher_id,
                lessons: {
                    connect: [
                        { lesson_id: args.lesson_id }
                    ]
                }
            }
        })
        return res
    }

    const queryExists = async (id) => {
        const res = await prisma.students.findUnique({
            where: {
                student_id: id,
            }
        })
        return res
    }
    
    const queryId = async (teacher_id,id) => {
        const res = await prisma.students.findUnique({
            where: {
                student_id: id,
                teacher_id: teacher_id
            },
            include: {
                lessons:true
            }
        })
        return res
    }
    
    const update = async (teacher_id,id, args) => {
        const res = await prisma.students.update({
            where: {
                student_id: id,
                teacher_id: teacher_id
            },
            data: {
                name: args.name,
            }
        })
        return res
    }

    const getInLesson = async (lesson_id) => {
        const res = await prisma.students.findMany({
            where: {
                lessons : {
                    some: {
                        lesson_id: lesson_id
                    }
                }
            },
            include: {
                lessons:true
            },
        })
        return res
    }

    const deleteId = async (teacher_id, student_id) => {
        const res = await prisma.students.delete({
            where: {
                teacher_id: teacher_id,
                student_id: student_id
            }
        })
        return res
    }
    return {
        deleteId,
        insert,
        queryId,
        getInLesson,
        queryExists,
        update,
    }
}

module.exports = {
    Subject,
    Lesson,
    User,
    Exam,
    Student,
}