const { body, validationResult } = require("express-validator");
const { 
    Subject,
} = require("../model/query");

const db = Subject();

const getSubjects = async (req,res) => {
    const user = req.user;
    const subjects = await db.queryAll(user.teacher_id);
    res.render("dashboard", {
        title: "Subjects",
        content: "subjects",
        subjects: subjects,
    })
}

const getSubject = async (req, res) => {
    const id = req.params.id;
    const subject = await db.queryId(id);
    const error = req.query.error || null
    res.render("dashboard", {
        title: `Subject: ${subject.name}`,
        content: "subject",
        subject: subject,
        error:error,
    })
}

const deleteSubject = async (req, res) => {
    try {
        const id = req.params.id;
        const response = await db.deleteId(id);
        console.log(response);
        res.redirect('/subjects');
    } catch (e) {
        console.log("Subject cannot be deleted if Lessons exist")
        res.redirect(`/subjects/subject/${req.params.id}?error=delete`)
    }
}

const newSubjectGet = (req, res) => {
    res.render("dashboard", {
        title: "New Subject",
        content:"new-subject",
        values: {}
    })
}

const editSubjectGet = async (req, res) => {
    const id = req.params.id;
    const subject = await db.queryId(id);
    console.log(id)
    res.render("dashboard", {
        title: `Edit Subject: ${subject.name}`,
        content:"new-subject",
        values: subject
    })
}

const validateSubject = [
    body("name").isLength({min:1, max:64}).withMessage("Name must be between 1 - 64 characters.")
]

const editSubjectPost = [
    validateSubject,
    async (req, res) => {
        const id = req.params.id;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).render("dashboard", {
                title: `Edit Subject ${req.body.name}`,
                content: "new-subject",
                errors: errors.array(),
                values: req.body
            });
        }
        const {name, textbook, description} = req.body;
        try {
            await db.update(id, {
                name,
                textbook,
                description
            });
        } catch (e) {
            console.log(e);
        }
        res.redirect(`/subjects/subject/${id}`)
    }
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
        const {name, textbook, description } = req.body;
        try {
            await db.insert({
                name,
                textbook,
                description,
                teacher_id: user.teacher_id
            });
            console.log(`New Subject: ${name}`);
        } catch (e) {
            console.log(e);
        }
        res.redirect('/subjects');
    }
]

const validateExma = [

]

module.exports = {
    editSubjectPost,
    editSubjectGet,
    deleteSubject,
    getSubjects,
    newSubjectGet,
    newSubjectPost,
    getSubject
}