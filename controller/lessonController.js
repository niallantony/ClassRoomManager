const { body, validationResult } = require("express-validator");
const { Lesson, Student, Exam } = require("../model/query");
const { query } = require("../model/pool");

const db = Lesson();
const student_db = Student();
const exam_db = Exam();

const getLessons = async (req, res) => {
  const user = req.user;
  const active = Object.keys(req.query).includes("find") ? false : true;
  const lessons = await db.queryAll(user.teacher_id, active);
  const values = [];
  lessons.forEach((lesson) => {
    values.push({
      lesson_id: lesson.lesson_id,
      name: lesson.name,
      year_semester: `${lesson.year}/${lesson.semester}`,
      subject: lesson.subjects.name,
      students: lesson.students.length,
    });
  });
  res.json({
    lessons: values,
  });
};

const getResults = async (req, res) => {
  const user = req.user;
  const lesson_id = +req.params.lesson_id;
  const exams = await db.getExams(+user.teacher_id, lesson_id);
  const results = await Promise.all(
    exams.map(async (exam) => {
      const examResults = await db.getResults(
        +user.teacher_id,
        lesson_id,
        exam.exam_id
      );
      return { [exam.exam_id]: examResults };
    })
  );
  const examResults = Object.assign({}, ...results);
  res.json({
    results: examResults,
  });
};

const putResults = async (req, res) => {
  const user = req.user;
  const body = req.body;
  const exam = +body.exam;
  const dbres = exam_db.updateGrades(+user.teacher_id, exam, req.body.results);
  res.json({
    response: dbres,
  });
};

const getLesson = async (req, res) => {
  const user = req.user;
  const id = +req.params.id;
  const lesson = await db.queryId(user.teacher_id, id);
  const students = await student_db.getInLesson(lesson.lesson_id);
  res.json({
    students: students,
    lesson: lesson,
  });
};

const deleteLesson = async (req, res) => {
  try {
    const id = req.params.id;
    const user = req.user;
    const response = await db.deleteId(user.teacher_id, id);
    res.json({
      message: "Successful",
    });
  } catch (e) {
    res.json({
      message: "Unsuccessful",
      errors: e,
    });
  }
};

const validateLesson = [
  body("year")
    .trim()
    .isLength({ min: 4, max: 4 })
    .withMessage("Please enter a valid year")
    .isNumeric()
    .withMessage("Please enter only numbers.")
    .toInt(),
  body("attendance")
    .trim()
    .isNumeric()
    .withMessage("Please enter a number")
    .isInt({ gt: 0, lt: 100 })
    .withMessage("Please enter a number between 0 - 100")
    .toInt(),
  body("name").isLength({ min: 1 }).withMessage("Please enter a name"),
  body("subject_id").notEmpty().withMessage("Please select a subject.").toInt(),
  body("class_start").notEmpty().withMessage("Please choose a start time"),
  body("semester").notEmpty().withMessage("Please enter a semester").toInt(),
];

const validateEdit = [
  body("attendance")
    .trim()
    .isNumeric()
    .withMessage("Please enter a number")
    .isInt({ gt: 0, lt: 100 })
    .withMessage("Please enter a number between 0 - 100")
    .toInt(),
  body("name").isLength({ min: 1 }).withMessage("Please enter a name"),
  body("class_start").notEmpty().withMessage("Please choose a start time"),
];

const returnDateTime = (timeString) => {
  const timeArray = timeString.split(":");
  const dateTime = new Date();
  dateTime.setHours(timeArray[0], timeArray[1]);
  return dateTime;
};

const editLesson = [
  validateEdit,
  async (req, res) => {
    const user = req.user;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors,
      });
    }
    const { name, attendance, classroom, class_start, forceactive } = req.body;
    try {
      await db.update(+user.teacher_id, +req.params.id, {
        name,
        attendance,
        classroom,
        class_start: returnDateTime(class_start),
        forceactive,
      });
      res.json({
        message: "Successful",
      });
    } catch (e) {
      res.status(400).json({
        message: "Unsuccessful",
        errors: e,
      });
      console.log(e);
    }
  },
];

const newLessonPost = [
  validateLesson,
  async (req, res) => {
    const user = req.user;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }
    const {
      name,
      semester,
      subject_id,
      attendance,
      classroom,
      class_start,
      year,
      forceactive,
    } = req.body;
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
        forceactive,
      });
      res.json({
        message: "Successful",
      });
    } catch (e) {
      res.json({
        message: "Unsuccessful",
      });
    }
  },
];

module.exports = {
  editLesson,
  deleteLesson,
  getLesson,
  getLessons,
  newLessonPost,
  getResults,
  putResults,
};
