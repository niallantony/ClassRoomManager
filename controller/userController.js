const { body, validationResult } = require("express-validator");
const { 
    insertUser,
 } = require("../model/query")
const bcrypt = require("bcryptjs")



const newUserGet = (req, res) => {
    res.render("layout", {
        title: "New User",
        content: "newUser",
        values: {}
    })
}

const loginGet = (req, res) => {
    res.render("layout", {
        title: "Log-in",
        content: "login"
    })
}

const loggedInGet = (req, res) => {
    res.render("dashboard", {
        title:"Logged In!",
        content:"subjects"
    })
}

const logoutGet = (req, res, next) => {
    req.session.user = null;
    req.session.save(function(err) {
        if (err) next(err)
        req.session.regenerate(function(err) {
            if (err) next(err)
            res.redirect('/')
        })
    })
}

const validateUser = [
    // Test both names, but only throw a single error - for UI purposes.
    // body("firstName").custom((value, {req}) => {
    //     const names = ['firstName','lastName'];
    //     const errors = [];
    //     console.log(names);
    //     names.forEach((name) => {
    //         if (!/^[a-zA-Z]+$/.test(req.body[name])) {
    //             errors.push(name);
    //         }
    //     });
    //     console.log(errors)
    //     if (errors.length > 0) {
    //         throw new Error("Name should only use alphabetic characters")
    //     }
    // }),
    body("email").trim()
        .isEmail().withMessage("Please enter a valid e-mail"),
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
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log(req.body)
            console.log(errors)
            return res.status(400).render("layout", {
                title: "New User",
                content:"newUser",
                errors: errors.array(),
                values: req.body
            });
        }
        const { firstName, lastName, email, password } = req.body;
        try {
            bcrypt.hash(password, 10, async (err, hashedPassword) => {
                if (err) {
                    throw new Error("Hashing failed.")
                }
                await insertUser(firstName, lastName, email, hashedPassword)
                console.log(`New user: ${firstName} ${lastName}`);
            })
        } catch (e) {
            console.log(e);
        }
        res.redirect('/');
    }
]

module.exports = {
    newUserGet,
    newUserPost,
    loginGet,
    loggedInGet,
    logoutGet
}