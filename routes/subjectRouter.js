const { Router } = require("express");
const {
  getSubjects,
  newSubjectGet,
  newSubjectPost,
  getSubject,
  deleteSubject,
  editSubjectPost,
  getExam,
  newExamGet,
  newExamPost,
  editExamGet,
  editExamPost,
  editSubjectWeek,
  deleteExam,
  getWeek,
} = require("../controller/subjectController");

const subjectRouter = Router();

const authenticateUser = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    return res.status(401).send({ message: "Unauthorised" });
  }
};

subjectRouter.get("/", authenticateUser, getSubjects);
subjectRouter.get("/new", authenticateUser, newSubjectGet);
subjectRouter.post("/new", authenticateUser, newSubjectPost);
subjectRouter.get("/subject/:id", getSubject);
subjectRouter.put("/subject/:id", editSubjectPost);
subjectRouter.put("/subject/:id/week/:week", editSubjectWeek);
subjectRouter.delete("/subject/:id", deleteSubject);
subjectRouter.get("/subject/:id/exam/:exam_id", getExam);
subjectRouter.get("/subject/:id/new-exam", newExamGet);
subjectRouter.post("/subject/:id/new-exam", newExamPost);
subjectRouter.get("/subject/:id/exam/:exam_id/edit", editExamGet);
subjectRouter.post("/subject/:id/exam/:exam_id/edit", editExamPost);
subjectRouter.get("/subject/:id/exam/:exam_id/delete", deleteExam);
subjectRouter.get("/subject/:id/week/:week", getWeek);

module.exports = subjectRouter;

