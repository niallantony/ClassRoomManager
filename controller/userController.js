const { body, validationResult } = require("express-validator");
const { 
    User
 } = require("../model/query")
const bcrypt = require("bcryptjs")

const db = User()


const newUserGet = (req, res) => {
    res.render("layout", {
        title: "New User",
        content: "new-user",
        values: {}
    })
}

const loginGet = (req, res) => {
    res.render("layout", {
        title: "Log-in",
        content: "login"
    })
}

const logoutGet = (req, res, next) => {
    req.session.user = null;
    req.session.save(function(err) {
        if (err) next(err)
        req.session.regenerate(function(err) {
            if (err) next(err)
            res.status(200).json({message: "Successfully Logged Out"}) 
        })
    })
}

const validateUser = [
    // Test both names, but only throw a single error - for UI purposes.
    body("firstname").trim().custom((value, {req}) => {
        const names = ['firstname','lastname'];
        const errors = [];
        names.forEach((name) => {
            if (!/^[a-zA-Z]+$/.test(req.body[name])) {
                errors.push(name);
            }
        });
        if (errors.length > 0) {
            console.log("Throwing Error");
            throw new Error("Name should only use alphabetic characters")
        }
        return true;
    }),
    body("lastname").trim(),
    body("email").trim()
        .isEmail().withMessage("Please enter a valid e-mail").bail()
        .custom(async (value) => {
            user = await db.queryEmail(value)
            if (user) {
                throw new Error('Email already exists')
            }
        }),
    body("vpassword").custom((value, {req}) => {
        if(value !== req.body.password) {
            throw new Error('Passwords must match')
        }
        return true;
    }),
    body("password").isStrongPassword({
            minNumbers: 0, 
            minLength: 8,
            minUppercase:1,
            minLowercase:1,
            minSymbols:1 }).withMessage("Password should contain a mix of uppercase, lowercase and special characters"),
    
]

const newUserPost = [
    validateUser,
    (req,res) => {
        console.log(req.body)
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).send({
                errors: errors.array(),
            });
        }
        const {firstname, lastname, email, password } = req.body;
        try {
            bcrypt.hash(password, 10, async (err, hashedPassword) => {
                if (err) {
                    throw new Error("Hashing failed.")
                }
                const db = User();
                await db.insert({
                    firstname,
                    lastname,
                    email,
                    password: hashedPassword
                })
            })
        } catch (e) {
            console.log(e);
        }
        res.redirect('/')
    }
]

module.exports = {
    newUserGet,
    newUserPost,
    loginGet,
    logoutGet
}