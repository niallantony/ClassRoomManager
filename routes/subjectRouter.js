const { Router } = require("express");
const { 
    getSubjects,
    newSubjectGet,
    newSubjectPost,
    getSubject,
    deleteSubject,
    editSubjectGet,
    editSubjectPost,
    getExam,
    newExamGet,
    newExamPost,
    editExamGet,
    editExamPost,
    deleteExam,
 } = require("../controller/subjectController");

const subjectRouter = Router();

subjectRouter.get('/', getSubjects);
subjectRouter.get('/new', newSubjectGet);
subjectRouter.post('/new', newSubjectPost);
subjectRouter.get('/subject/:id', getSubject);
subjectRouter.get('/subject/:id/delete', deleteSubject)
subjectRouter.get('/subject/:id/edit', editSubjectGet)
subjectRouter.post('/subject/:id/edit', editSubjectPost)
subjectRouter.get('/subject/:id/exam/:exam_id', getExam)
subjectRouter.get('/subject/:id/new-exam', newExamGet)
subjectRouter.post('/subject/:id/new-exam', newExamPost)
subjectRouter.get('/subject/:id/exam/:exam_id/edit', editExamGet)
subjectRouter.post('/subject/:id/exam/:exam_id/edit', editExamPost)
subjectRouter.get('/subject/:id/exam/:exam_id/delete', deleteExam)

module.exports = subjectRouter;