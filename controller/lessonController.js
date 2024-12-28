const { body, validationResult } = require("express-validator");
const { Subject, Lesson, Student } = require("../model/query");

const subjectdb = Subject();
const db = Lesson();
const student_db = Student();

const getLessons = async (req, res) => {
  const user = req.user;
  const lessons = await db.queryAll(user.teacher_id);
  console.log(lessons);
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
    console.log(response);
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
    const { name, attendance, classroom, class_start } = req.body;
    try {
      await db.update(+user.teacher_id, +req.params.id, {
        name,
        attendance,
        classroom,
        class_start: returnDateTime(class_start),
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
};

