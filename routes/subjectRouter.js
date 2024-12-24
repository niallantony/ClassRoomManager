const { Router } = require("express");
const {
  getSubjects,
  newSubjectPost,
  getSubject,
  deleteSubject,
  editSubjectPost,
  getExam,
  newExamPost,
  editExamGet,
  editExamPost,
  editSubjectWeek,
  deleteExam,
  getWeek,
  getSubjectNames,
  getWeeks,
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
subjectRouter.post("/new", newSubjectPost);
subjectRouter.get("/names", getSubjectNames);
subjectRouter.get("/subject/:id", authenticateUser, getSubject);
subjectRouter.put("/subject/:id", editSubjectPost);
subjectRouter.get("/subject/:id/weeks", authenticateUser, getWeeks);
subjectRouter.put("/subject/:id/week/:week", editSubjectWeek);
subjectRouter.delete("/subject/:id", deleteSubject);
subjectRouter.get("/subject/:id/exam/:exam_id", authenticateUser, getExam);
subjectRouter.post("/subject/:id/new-exam", newExamPost);
subjectRouter.get(
  "/subject/:id/exam/:exam_id/edit",
  authenticateUser,
  editExamGet
);
subjectRouter.post("/subject/:id/exam/:exam_id/edit", editExamPost);
subjectRouter.get(
  "/subject/:id/exam/:exam_id/delete",
  authenticateUser,
  deleteExam
);
subjectRouter.get("/subject/:id/week/:week", authenticateUser, getWeek);

module.exports = subjectRouter;
