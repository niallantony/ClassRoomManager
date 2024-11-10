const { Router } = require("express");
const { 
    getSubjects,
    newSubjectGet,
    newSubjectPost,
    getSubject
 } = require("../controller/subjectController");

const subjectRouter = Router();

subjectRouter.get('/', getSubjects);
subjectRouter.get('/new', newSubjectGet);
subjectRouter.post('/new', newSubjectPost);
subjectRouter.get('/subject/:id', getSubject);

module.exports = subjectRouter;