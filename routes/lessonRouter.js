const { Router } = require("express");
const { 
    getNewLesson,
    newLessonPost,
    getLessons,
    getLesson,
    deleteLesson,
    editLessonGet,
    editLessonPost,
 } = require("../controller/lessonController");

const lessonRouter = Router();

lessonRouter.get('/', getLessons)
lessonRouter.get('/lesson/:id', getLesson)
lessonRouter.get('/new', getNewLesson);
lessonRouter.post('/new', newLessonPost);
lessonRouter.get('/lesson/:id/delete', deleteLesson)
lessonRouter.post('/lesson/:id/edit', editLessonPost)
lessonRouter.get('/lesson/:id/edit', editLessonGet)

module.exports = lessonRouter