const { Router } = require("express");
const { 
    getNewLesson,
    newLessonPost,
    getLessons,
    getLesson,
 } = require("../controller/lessonController");

const lessonRouter = Router();

lessonRouter.get('/', getLessons)
lessonRouter.get('/lesson/:lessonid', getLesson)
lessonRouter.get('/new', getNewLesson);
lessonRouter.post('/new', newLessonPost);

module.exports = lessonRouter