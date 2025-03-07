/* eslint-disable no-undef */
const { Router } = require("express");
const {
  newLessonPost,
  getLessons,
  getLesson,
  deleteLesson,
  editLesson,
  getResults,
  putResults,
} = require("../controller/lessonController");
const { getStudents } = require("../controller/studentController");

const lessonRouter = Router();

const authenticateUser = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    return res.status(401).send({ message: "Unauthorised" });
  }
};

lessonRouter.get("/", authenticateUser, getLessons);
lessonRouter.get("/lesson/:id", authenticateUser, getLesson);
lessonRouter.put("/lesson/:id", authenticateUser, editLesson);
lessonRouter.delete("/lesson/:id", authenticateUser, deleteLesson);
lessonRouter.post("/new", authenticateUser, newLessonPost);
lessonRouter.get("/lesson/:lesson_id/students", authenticateUser, getStudents);
lessonRouter.get("/lesson/:lesson_id/results", authenticateUser, getResults);
lessonRouter.put("/lesson/:lesson_id/results", authenticateUser, putResults);

module.exports = lessonRouter;
