const {Student, Lesson} = require("../model/query")
const { body, validationResult } = require("express-validator")

const db = Student()
const lesson_db = Lesson()

const getNewStudent = async (req, res) => {
    const user = req.user
    const lessons = await lesson_db.getNames(user.teacher_id)
    console.log(lessons)
    res.render("dashboard", {
        title: "New Student",
        content: "new-student",
        lessons: lessons,
        values: {}
    })
}

const getStudent = async (req, res) => {
    const user = req.user
    const student_id = req.params.student_id
    const student = await db.queryId(+user.teacher_id, +student_id);
    console.log(student)
    res.render("dashboard", {
        title: "New Student",
        content: "student",
        student: student,
    })
}

const validateStudent = [
    body("student_id").isInt().withMessage("Please include Student ID as a number").bail()
    .toInt().custom((async (value) => {
        const existingStudent = await db.queryExists(value);
        if (existingStudent) {
            throw new Error("Student ID already in use")
        }
    })),
    body("lesson_id").toInt(),
]

const validateName = [
    body('name').trim().exists(),
]

const postNewStudent = [
    validateStudent,
    validateName,
    async (req, res) => {
        const errors = validationResult(req);
        const user = req.user
        if (!errors.isEmpty()) {
            const lessons = await lesson_db.getNames(user.teacher_id)
            console.log(lessons)
            return res.status(400).render("dashboard",{
                title: "New Student",
                content: "new-student",
                lessons: lessons,
                errors: errors.array(),
                values: req.body
            })
        }
        const { student_id, name, lesson_id } = req.body;
        try {
            await db.insert({
                student_id,
                name,
                lesson_id,
                teacher_id: user.teacher_id,
            })
            console.log(`New Student: ${name}`)
            res.redirect(`/lessons/lesson/${lesson_id}`)
        } catch (e) {
            console.log(e)
        }
    }
]

const getEditStudent = async (req, res) => {
    const user = req.user;
    const student = await db.queryId(+user.teacher_id, +req.params.student_id);
    res.render("dashboard", {
        title:`Edit ${student.name}`,
        content: "edit-student",
        values: student,
    })
}

const postEditStudent = [
    validateName,
    async (req, res) => {
        const errors = validationResult(req);
        const user = req.user
        const student_id = req.params.student_id
        const student = await db.queryId(+user.teacher_id, +student_id)
        if (!errors.isEmpty()){
            console.log(errors)
            return res.status(400).render("dashboard", {
                title: `Edit ${student.name}`,
                content: "edit-student",
                errors: errors.array(),
                values: req.body
            })
        }
        const { name } = req.body
        try {
            await db.update(+user.teacher_id, +student_id, {
                name: name
            })
            res.redirect(`/students/student/${student_id}`)
        } catch (e) {
            console.log(e)
            res.redirect(`/students/student/${student_id}`)
        }
    }
]

const deleteStudent = async (req, res) => {
    const user = req.user;
    const response = await db.deleteId(+user.teacher_id, +req.params.student_id);
    console.log(response)
    res.redirect('/lessons')

}

const getStudents = async (req, res) => {
    const user = req.user;
    const lesson = await lesson_db.queryId(+user.teacher_id, +req.params.lesson_id);
    const students = await db.getInLesson(+req.params.lesson_id);
    res.render("dashboard", {
        title: `${lesson.name} - students`,
        content: 'students',
        students: students,
    })
}

module.exports = {
    getStudents,
    getNewStudent,
    postNewStudent,
    getStudent,
    getEditStudent,
    postEditStudent,
    deleteStudent,
}