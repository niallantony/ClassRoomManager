const { Router } = require("express");
const { 
    getNewLesson,
 } = require("../controller/lessonController");

const lessonRouter = Router();

lessonRouter.get('/new', getNewLesson);

module.exports = lessonRouter