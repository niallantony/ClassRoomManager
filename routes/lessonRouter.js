/* eslint-disable no-undef */
const { Router } = require("express");
const {
  newLessonPost,
  getLessons,
  getLesson,
  deleteLesson,
  editLesson,
} = require("../controller/lessonController");
const { getStudents } = require("../controller/studentController");

const lessonRouter = Router();

lessonRouter.get("/", getLessons);
lessonRouter.get("/lesson/:id", getLesson);
lessonRouter.put("/lesson/:id", editLesson);
lessonRouter.delete("/lesson/:id", deleteLesson);
lessonRouter.post("/new", newLessonPost);
lessonRouter.get("/lesson/:id/delete", deleteLesson);
lessonRouter.get("/lesson/:lesson_id/students", getStudents);

module.exports = lessonRouter;

