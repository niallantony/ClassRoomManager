const { body, validationResult } = require("express-validator");
const { 
    querySubject, 
    querySubjects,
    insertSubject,
} = require("../model/query");

const getSubjects = async (req,res) => {
    const user = req.user;
    console.log(res.locals)
    const subjects = await querySubjects(user.teacher_id);
    res.render("dashboard", {
        title: "Subjects",
        content: "subjects",
        subjects: subjects,
    })
}

const getSubject = async (req, res) => {
    const id = req.params.id;
    const subject = await querySubject(id)
    res.render("dashboard", {
        title: `Subject: ${subject.name}`,
        content: "subject",
        subject: subject,
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
        const user = req.user;
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
            await insertSubject(name,textbook,description,user.teacher_id);
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
    getSubject
}