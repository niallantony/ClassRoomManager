const { Router } = require("express");
const { 
    getNewLesson,
    newLessonPost,
    getLessons,
    getLesson,
    deleteLesson,
 } = require("../controller/lessonController");

const lessonRouter = Router();

lessonRouter.get('/', getLessons)
lessonRouter.get('/lesson/:id', getLesson)
lessonRouter.get('/new', getNewLesson);
lessonRouter.post('/new', newLessonPost);
lessonRouter.get('/lesson/:id/delete', deleteLesson)

module.exports = lessonRouter