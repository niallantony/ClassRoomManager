const { body, validationResult } = require("express-validator");
const { 
    querySubject, 
    querySubjects,
    insertSubject,
} = require("../model/query");

// CHANGE THIS!
const TEST_TEACHER_ID = 3;

const getSubjects = (req,res) => {
    res.render("dashboard", {
        title: "Subjects",
        content: "subjects",
        values: {}
    })
}

const newSubjectGet = (req, res) => {
    res.render("dashboard", {
        title: "New Subject",
        content:"new-subject",
        values: {}
    })
}

const validateSubject = [
    body("name").isLength({min:1, max:64}).withMessage("Name must be between 1 - 64 characters.")
]

const newSubjectPost = [
    validateSubject,
    async (req,res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).render("dashboard", {
                title: "New Subject",
                content: "new-subject",
                errors: errors.array(),
                values: req.body
            });
        }
        const { name, textbook, description } = req.body;
        try {
            await insertSubject(name,textbook,description,TEST_TEACHER_ID);
            console.log(`New Subject: ${name}`);
        } catch (e) {
            console.log(e);
        }
        res.redirect('/');
    }
]

module.exports = {
    getSubjects,
    newSubjectGet,
    newSubjectPost,
}