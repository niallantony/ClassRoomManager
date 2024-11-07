const { body, validationResult } = require("express-validator");
const { insertUser } = require("../model/query")

const alphaErr = "Must only contain letters";

const newUserGet = (req, res) => {
    res.render("newUser", {
        title: "New User",
        values: {}
    })
}

const validateUser = [
    body("firstName").trim()
        .isAlpha().withMessage(`First name ${alphaErr}`),
    body("lastName").trim()
        .isAlpha().withMessage(`Last name ${alphaErr}`),
    body("email").trim()
        .isEmail().withMessage("Please enter a valid e-mail"),
    body("vpassword").custom((value, {req}) => {
        if(value !== req.body.password) {
            throw new Error('Passwords must match')
        }
        return true;
    }),
    body("password").isStrongPassword({
            minLength: 8,
            minUppercase:1,
            minLowercase:1,
            minSymbols:1 }).withMessage("Please enter a strong password (At least 8 characters, containing Uppercase, Lowercase and special characters."),
    
]

const newUserPost = [
    validateUser,
    (req,res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log(req.body)
            return res.status(400).render("newUser", {
                title: "New User",
                errors: errors.array(),
                values: req.body
            });
        }
        const { firstName, lastName, email, password } = req.body;
        insertUser(firstName, lastName, email, password);
        console.log(`New user: ${firstName} ${lastName}`);
        res.redirect('/');
    }
]

module.exports = {
    newUserGet,
    newUserPost,
}