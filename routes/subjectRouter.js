const { Router } = require("express");
const { 
    getSubjects,
    newSubjectGet,
    newSubjectPost,
    getSubject,
    deleteSubject,
    editSubjectGet,
    editSubjectPost
 } = require("../controller/subjectController");

const subjectRouter = Router();

subjectRouter.get('/', getSubjects);
subjectRouter.get('/new', newSubjectGet);
subjectRouter.post('/new', newSubjectPost);
subjectRouter.get('/subject/:id', getSubject);
subjectRouter.get('/subject/:id/delete', deleteSubject)
subjectRouter.get('/subject/:id/edit', editSubjectGet)
subjectRouter.post('/subject/:id/edit', editSubjectPost)

module.exports = subjectRouter;