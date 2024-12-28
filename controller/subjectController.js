const { body, validationResult } = require("express-validator");
const { Subject, Exam } = require("../model/query");

const db = Subject();
const exam_db = Exam();

const getSubjects = async (req, res) => {
  const user = req.user;
  const subjects = await db.queryAll(user.teacher_id);
  return res.json({
    subjects: subjects,
  });
};

const getSubjectNames = async (req, res) => {
  const user = req.user;
  const subjects = await db.queryNames(user.teacher_id);
  subjects.forEach((subject) => {
    subject["value"] = subject.subject_id;
  });
  return res.json({
    subjects: subjects,
  });
};

const getSubject = async (req, res) => {
  const id = req.params.id;
  const teacher_id = req.user.teacher_id;
  const subject = await db.querySubjectInfoAll(teacher_id, id);
  const error = req.query.error || null;
  if (!subject) {
    return res.status(400).json({
      error: "Subject Not Found",
    });
  }
  res.json({
    subject: subject,
    error: error,
  });
};

const getExam = async (req, res) => {
  const user = req.user;
  const id = req.params.exam_id;
  const exam = await exam_db.queryId(user.teacher_id, id);
  console.log(exam);
  res.json({
    exam: exam,
  });
};

const getWeeks = async (req, res) => {
  const id = req.params.subject_id;
  const weeks = await db.queryWeeks(id);
  weeks.forEach((week) => {
    week["value"] = week.week;
  });
  res.json({
    weeks: weeks,
  });
};

const getWeek = async (req, res) => {
  const id = req.params.id;
  const teacher_id = req.user.teacher_id;
  const week = req.params.week;
  const response = await db.queryWeek(teacher_id, id, week);
  const error = req.query.error || null;
  if (!response) {
    return res.status(400).json({
      error: "Subject Week Not Found",
    });
  }
  res.json({
    week: response,
    error: error,
  });
};

const deleteSubject = async (req, res) => {
  try {
    const id = req.params.id;
    await db.deleteId(id);
    res.json({
      message: "Successful",
    });
  } catch (e) {
    console.log("Subject cannot be deleted if Lessons exist");
    res.status(400).json({
      error: e,
    });
  }
};

const deleteExam = async (req, res) => {
  try {
    const id = req.params.exam_id;
    const user = req.user;
    const response = await exam_db.deleteId(user.teacher_id, id);
    console.log(response);
    res.json({
      message: "Successful",
    });
  } catch (e) {
    res.json({
      errors: e,
      message: "Unsuccessful",
    });
  }
};

const validateSubject = [
  body("name")
    .trim()
    .isLength({ min: 1, max: 64 })
    .withMessage("Name must be between 1 - 64 characters."),
  body("weeks")
    .toInt()
    .isInt({ min: 1, max: 52 })
    .withMessage("Subject should be between 1-52 weeks"),
];

const editSubjectPost = [
  validateSubject,
  async (req, res) => {
    const id = req.params.id;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        errors: errors,
      });
    }
    const user = req.user;
    const { name, textbook, description } = req.body;
    try {
      await db.update(user.teacher_id, id, {
        name,
        textbook,
        description,
      });
      res.json({
        message: "Successful",
      });
    } catch (e) {
      console.log(e);
    }
  },
];

const editSubjectWeek = async (req, res) => {
  const id = req.params.id;
  const weekId = req.params.week;
  const teacher_id = req.user.teacher_id;
  const { description } = req.body;
  try {
    await db.updateWeek(teacher_id, id, weekId, description);
    res.json({
      message: "Successful",
    });
  } catch (e) {
    console.log(e);
  }
};

const newSubjectPost = [
  validateSubject,
  async (req, res) => {
    const user = req.user;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send(errors);
    }
    const { name, textbook, description, weeks } = req.body;
    try {
      await db.insertWithWeeks({
        name,
        textbook,
        description,
        teacher_id: user.teacher_id,
        weeks,
      });
      console.log(`New Subject: ${name}`);
      res.json({ message: "Successful" });
    } catch (e) {
      console.log(e);
      res.json({
        message: "Unsuccessful",
        error: e,
      });
    }
  },
];

const validateExam = [
  body("name").trim().exists().withMessage("Please enter a name"),
  body("marks")
    .trim()
    .isNumeric()
    .withMessage("Please enter marks as a number")
    .toInt(),
  body("percent")
    .trim()
    .isNumeric()
    .withMessage("Please enter percentage as a number")
    .toInt()
    .isInt({ max: 100, min: 0 })
    .withMessage("Must be a number below 100"),
  body("type").trim().exists().withMessage("Please select exam type"),
  body("week").toInt(),
  body("subject_id").toInt(),
];

const newExamPost = [
  validateExam,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("Errors found", errors);
      return res.status(400).json({
        errors: errors,
      });
    }
    const { name, marks, percent, type, subject_id, week } = req.body;
    try {
      await exam_db.insertToWeek({
        name,
        week,
        marks,
        subject_id,
        percent,
        type,
      });
      console.log(`New Exam: ${name}`);
    } catch (e) {
      console.log(e);
    }
    res.redirect(`/subjects/subject/${subject_id}/`);
  },
];

const editExam = [
  validateExam,
  async (req, res) => {
    const user = req.user;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("Errors found", errors);
      return res.status(400).json({
        errors: errors.array(),
      });
    }
    const { week, name, marks, percent, type } = req.body;
    try {
      await exam_db.update(+user.teacher_id, +req.params.exam_id, {
        name,
        marks,
        percent,
        type,
        week,
      });
      res.json({
        message: "Successful",
      });
    } catch (e) {
      res.status(400).json({
        errors: e,
        message: "Unsuccessful",
      });
    }
  },
];

module.exports = {
  editSubjectPost,
  editExam,
  deleteSubject,
  getSubjects,
  newSubjectPost,
  getSubject,
  newExamPost,
  getExam,
  deleteExam,
  getWeek,
  editSubjectWeek,
  getSubjectNames,
  getWeeks,
};
