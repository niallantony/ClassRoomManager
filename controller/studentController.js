const { Student, Lesson } = require("../model/query");
const { body, validationResult } = require("express-validator");

const db = Student();
const lesson_db = Lesson();

const getStudent = async (req, res) => {
  const user = req.user;
  const student_id = req.params.student_id;
  const student = await db.queryId(+user.teacher_id, +student_id);
  const exams = await db.getExams(+user.teacher_id, +student_id);
  res.json({
    student: student,
    exams: exams,
  });
};

const validateStudent = [
  body("student_id")
    .isInt({ min: 1 })
    .withMessage("Please include Student ID as a number")
    .bail()
    .toInt()
    .custom(async (value) => {
      const existingStudent = await db.queryExists(value);
      if (existingStudent) {
        throw new Error("Student ID already in use");
      }
    }),
  body("lesson_id").toInt(),
];

const validateName = [body("name").trim().exists()];

const postNewStudent = [
  validateStudent,
  validateName,
  async (req, res) => {
    const errors = validationResult(req);
    const user = req.user;
    if (!errors.isEmpty()) {
      const lessons = await lesson_db.getNames(user.teacher_id);
      console.log(lessons);
      return res.status(400).json({
        errors: errors.array(),
      });
    }
    const { student_id, name, lesson_id } = req.body;
    try {
      await db.insert({
        student_id,
        name,
        lesson_id,
        teacher_id: user.teacher_id,
      });
      console.log(`New Student: ${name}`);
      res.json({
        message: "Successful",
      });
    } catch (e) {
      console.log(e);
      res.json({
        message: "Unsuccessful",
        errors: e,
      });
    }
  },
];

const editStudent = [
  validateName,
  async (req, res) => {
    const errors = validationResult(req);
    const user = req.user;
    const student_id = req.params.student_id;
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }
    const { name } = req.body;
    try {
      await db.update(+user.teacher_id, +student_id, {
        name: name,
      });
      res.json({
        message: "Successful",
      });
    } catch (e) {
      res.json({
        message: "Unsuccessful",
        errors: e,
      });
    }
  },
];

const deleteStudent = async (req, res) => {
  try {
    const user = req.user;
    console.log(req.params.student_id);
    await db.deleteId(+user.teacher_id, +req.params.student_id);
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

const getStudents = async (req, res) => {
  const user = req.user;
  const students = await db.getInLesson(user.teacher_id, +req.params.lesson_id);
  res.json({
    students: students,
  });
};

module.exports = {
  getStudents,
  postNewStudent,
  getStudent,
  editStudent,
  deleteStudent,
};
