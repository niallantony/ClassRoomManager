const { body, validationResult } = require("express-validator");
const { 
    querySubject, 
    querySubjects,
} = require("../model/query");

const getLessons = (res, req) => {

}

const getNewLesson = async (req, res) => {
    const user = req.user;
    console.log(user)
    const subjects = await querySubjects(user.teacher_id);
    res.render("dashboard", {
        title:"New Class",
        content:"new-class",
        subjects:subjects,
    })
}

module.exports = {
    getNewLesson,
    getLessons
}