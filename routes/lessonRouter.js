/* eslint-disable no-undef */
const { Router } = require("express");
const {
  newLessonPost,
  getLessons,
  getLesson,
  deleteLesson,
  editLessonPost,
} = require("../controller/lessonController");
const { getStudents } = require("../controller/studentController");

const lessonRouter = Router();

lessonRouter.get("/", getLessons);
lessonRouter.get("/lesson/:id", getLesson);
lessonRouter.post("/new", newLessonPost);
lessonRouter.get("/lesson/:id/delete", deleteLesson);
lessonRouter.post("/lesson/:id/edit", editLessonPost);
lessonRouter.get("/lesson/:lesson_id/students", getStudents);

module.exports = lessonRouter;

