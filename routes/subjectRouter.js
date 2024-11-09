const { Router } = require("express");
const { 
    getSubjects,
    newSubjectGet,
    newSubjectPost,
 } = require("../controller/subjectController");

const subjectRouter = Router();

subjectRouter.get('/', getSubjects);
subjectRouter.get('/new', newSubjectGet);
subjectRouter.post('/new', newSubjectPost);

module.exports = subjectRouter;