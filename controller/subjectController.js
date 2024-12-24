const { body, validationResult } = require("express-validator");
const { Subject, Exam } = require("../model/query");

const db = Subject();
const exam_db = Exam();

const getSubjects = async (req, res) => {
  const user = req.user;
  const subjects = await db.queryAll(user.teacher_id);
  console.log("Subjects: ", subjects);

  return res.json({
    subjects: subjects,
  });
};

const getSubject = async (req, res) => {
  const id = req.params.id;
  const teacher_id = req.user.teacher_id;
  const subject = await db.querySubjectInfoAll(teacher_id, id);
  console.log(subject);
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
  const id = req.params.exam_id;
  const exam = await exam_db.queryId(id);
  res.render("dashboard", {
    title: `Exam: ${exam.name}`,
    content: "exam",
    exam: exam,
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
    const response = await db.deleteId(id);
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
  const subject_id = req.params.id;
  try {
    const id = req.params.exam_id;
    const response = await exam_db.deleteId(id);
    console.log(response);
    res.redirect(`/subjects/subject/${subject_id}`);
  } catch (e) {
    console.log("Exam cannot be deleted");
    res.redirect(`/subjects/subject/${subject_id}?error=exam-delete`);
  }
};

const newSubjectGet = (req, res) => {
  res.render("dashboard", {
    title: "New Subject",
    content: "new-subject",
    values: {},
  });
};

const editSubjectGet = async (req, res) => {
  const id = req.params.id;
  const subject = await db.queryId(id);
  res.render("dashboard", {
    title: `Edit Subject: ${subject.name}`,
    content: "new-subject",
    values: subject,
  });
};

const editExamGet = async (req, res) => {
  const user = req.user;
  console.log(user);
  const id = req.params.exam_id;
  const exam = await exam_db.queryId(id);
  const subjects = await db.queryAll(user.teacher_id);
  res.render("dashboard", {
    title: `Edit: ${exam.name}`,
    content: "new-exam",
    values: exam,
    subjects: subjects,
  });
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

const newExamGet = async (req, res) => {
  res.render("dashboard", {
    title: "New Exam",
    content: "new-exam",
    values: {},
  });
};

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
];

const newExamPost = [
  validateExam,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("Errors found", errors);
      return res.status(400).render("dashboard", {
        title: "New Exam",
        content: "new-exam",
        errors: errors.array(),
        values: req.body,
      });
    }
    const { name, marks, percent, type } = req.body;
    const subject_id = +req.params.id;
    try {
      await exam_db.insert({
        name,
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

const editExamPost = [
  validateExam,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("Errors found", errors);
      return res.status(400).render("dashboard", {
        title: `Edit ${req.body.name}`,
        content: "new-exam",
        errors: errors.array(),
        values: req.body,
      });
    }
    const { name, marks, percent, type } = req.body;
    const subject_id = +req.params.id;
    try {
      await exam_db.update(+req.params.exam_id, {
        name,
        marks,
        percent,
        type,
      });
      console.log(`Updated Exam: ${name}`);
    } catch (e) {
      console.log(e);
    }
    res.redirect(`/subjects/subject/${subject_id}/`);
  },
];

module.exports = {
  editSubjectPost,
  editExamPost,
  editSubjectGet,
  deleteSubject,
  getSubjects,
  newSubjectGet,
  newSubjectPost,
  getSubject,
  newExamGet,
  newExamPost,
  getExam,
  editExamGet,
  deleteExam,
  getWeek,
  editSubjectWeek,
};

