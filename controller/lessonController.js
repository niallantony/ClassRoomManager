const { body, validationResult } = require("express-validator");
const { 
    querySubjects,
    queryLessons,
    queryLesson,
    insertLesson,
} = require("../model/query");

const getLessons = async (req, res) => {
    const user = req.user;
    const lessons = await queryLessons(user.teacher_id);
    res.render("dashboard", {
        title: "Lessons",
        content:"lessons",
        lessons:lessons
    })
}

const getLesson = async (req, res) => {
    const user = req.user;
    const id = +req.params.lessonid;
    const lesson = await queryLesson(user.teacher_id, id);
    res.render("dashboard", {
        title: lesson.name,
        content:"lesson",
        lesson:lesson,
    })
}

const getNewLesson = async (req, res) => {
    const user = req.user;
    const subjects = await querySubjects(user.teacher_id);
    res.render("dashboard", {
        title:"New Lesson",
        content:"new-lesson",
        values:{},
        subjects:subjects,
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

const newLessonPost = [
    validateLesson,
    async (req,res) => {
        const user = req.user;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const subjects = await querySubjects(user.teacher_id);
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
            await insertLesson({
                teacher_id: user.teacher_id,
                name,
                subject_id,
                attendance,
                classroom,
                class_start: returnDateTime(class_start),
                year,
                semester,
            })
        } catch (e) {
            console.log(e)
        }
    }
]

module.exports = {
    getLesson,
    getLessons,
    getNewLesson,
    getLessons,
    newLessonPost
}