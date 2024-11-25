const { Router } = require("express");
const { 
    getSubjects,
    newSubjectGet,
    newSubjectPost,
    getSubject,
    deleteSubject
 } = require("../controller/subjectController");

const subjectRouter = Router();

subjectRouter.get('/', getSubjects);
subjectRouter.get('/new', newSubjectGet);
subjectRouter.post('/new', newSubjectPost);
subjectRouter.get('/subject/:id', getSubject);
subjectRouter.get('/subject/:id/delete', deleteSubject)

module.exports = subjectRouter;