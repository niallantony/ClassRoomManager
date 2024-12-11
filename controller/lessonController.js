const { body, validationResult } = require("express-validator");
const { 
    Subject,
    Lesson,
    Student,
} = require("../model/query");

const subjectdb = Subject();
const db = Lesson();
const student_db = Student();

const getLessons = async (req, res) => {
    const user = req.user;
    const lessons = await db.queryAll(user.teacher_id);
    res.render("dashboard", {
        title: "Lessons",
        content:"lessons",
        lessons:lessons
    })
}

const getLesson = async (req, res) => {
    const user = req.user;
    const id = +req.params.id;
    const lesson = await db.queryId(user.teacher_id, id);
    const students = await student_db.getInLesson(lesson.lesson_id)
    res.render("dashboard", {
        title: lesson.name,
        content:"lesson",
        students:students,
        lesson:lesson,
    })
}

const getNewLesson = async (req, res) => {
    const user = req.user;
    const subjects = await subjectdb.queryAll(user.teacher_id);
    res.render("dashboard", {
        title:"New Lesson",
        content:"new-lesson",
        values:{},
        subjects:subjects,
    })
}

const deleteLesson = async (req, res) => {
    const id = req.params.id;
    const response = await db.deleteId(id);
    console.log(response);
    res.redirect('/lessons');
}

const editLessonGet = async (req, res) => {
    const id = req.params.id;
    const user = req.user;
    const lesson = await db.queryId(user.teacher_id,+id);
    lesson.class_start = returnTime(lesson.class_start)
    const subjects = await subjectdb.queryAll(user.teacher_id);
    console.log(lesson.class_start)
    res.render("dashboard", {
        title: `Edit Lesson: ${lesson.name}`,
        content: "new-lesson",
        values: lesson,
        subjects: subjects
    })
}

const validateLesson = [
    body("year").trim()
        .isLength({min:4,max:4}).withMessage("Please enter a valid year")
        .isNumeric().withMessage("Please enter only numbers.")
        .toInt(),
    body("attendance").trim()
        .isNumeric().withMessage("Please enter a number")
        .isInt({gt:0,lt:100}).withMessage("Please enter a number between 0 - 100")
        .toInt(),
    body("name")
        .isLength({min:1}).withMessage("Please enter a name"),
    body("subject_id")
        .notEmpty().withMessage("Please select a subject.")
        .toInt(),
    body("class_start")
        .notEmpty().withMessage("Please choose a start time"),
    body("semester").toInt(),
]


const returnDateTime = (timeString) => {
    const timeArray = timeString.split(':');
    const dateTime = new Date();
    dateTime.setHours(timeArray[0], timeArray[1]);
    return dateTime;
}

const returnTime = (dateTime) => {
    return `${String(dateTime.getHours()).padStart(2,'0')}:${String(dateTime.getMinutes()).padStart(2,'0')}`
}

const editLessonPost = [
    validateLesson,
    async (req,res) => {
        const user = req.user;
        const errors = validationResult(req);
        const lesson = await db.queryId(user.teacher_id, +req.params.id)
        if (!errors.isEmpty()) {
            const subjects = await subjectdb.queryAll(user.teacher_id)
            return res.status(400).render("dashboard", {
                title: `Edit Lesson: ${lesson.name}`,
                content:"new-lesson",
                errors: errors.array(),
                subjects:subjects,
                values: req.body
            });
        }
        const {
            name,
            semester,
            subject_id,
            attendance,
            classroom,
            class_start,
            year
        } = req.body;
        try {
            await db.update(+req.params.id, {
                name,
                semester,
                subject_id,
                attendance,
                classroom,
                class_start: returnDateTime(class_start),
                year,
            })
        res.redirect(`/lessons/lesson/${req.params.id}`)
        } catch (e) {
            console.log(e)
        }

    }
]

const newLessonPost = [
    validateLesson,
    async (req,res) => {
        const user = req.user;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const subjects = await subjectdb.queryAll(user.teacher_id);
            return res.status(400).render("dashboard", {
                title: "New Lesson",
                content: "new-lesson",
                errors: errors.array(),
                subjects:subjects,
                values: req.body
            });
        }
        const {name, semester, subject_id, attendance, classroom, class_start, year} = req.body;
        try {
            await db.insert({
                teacher_id: user.teacher_id,
                name,
                subject_id,
                attendance,
                classroom,
                class_start: returnDateTime(class_start),
                year,
                semester,
            })
        res.redirect('/lessons')
        } catch (e) {
            console.log(e)
        }
    }
]

module.exports = {
    editLessonGet,
    editLessonPost,
    deleteLesson,
    getLesson,
    getLessons,
    getNewLesson,
    newLessonPost
}