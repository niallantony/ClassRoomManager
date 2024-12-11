const { Router } = require("express");
const { 
    getNewStudent,
    postNewStudent,
    getStudents,
    getStudent,
    getEditStudent,
    postEditStudent,
    deleteStudent,
 } = require("../controller/studentController");

const studentRouter = Router();

studentRouter.get('/new', getNewStudent)
studentRouter.post('/new', postNewStudent)
studentRouter.get('/:lesson_id', getStudents)
studentRouter.get('/student/:student_id', getStudent)
studentRouter.get('/student/:student_id/edit', getEditStudent)
studentRouter.post('/student/:student_id/edit', postEditStudent)
studentRouter.get('/student/:student_id/delete', deleteStudent)

module.exports = studentRouter