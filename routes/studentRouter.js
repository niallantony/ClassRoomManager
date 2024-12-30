const { Router } = require("express");
const {
  postNewStudent,
  getStudents,
  getStudent,
  editStudent,
  deleteStudent,
} = require("../controller/studentController");

const studentRouter = Router();

const authenticateUser = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    return res.status(401).send({ message: "Unauthorised" });
  }
};

studentRouter.post("/new", authenticateUser, postNewStudent);
studentRouter.get("/:lesson_id", authenticateUser, getStudents);
studentRouter.get("/student/:student_id", authenticateUser, getStudent);
studentRouter.delete("/student/:student_id", authenticateUser, deleteStudent);
studentRouter.put("/student/:student_id", authenticateUser, editStudent);

module.exports = studentRouter;

