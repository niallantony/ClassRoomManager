const { Router } = require("express");
const { 
    newUserGet, 
    newUserPost,
    loginGet,
    logoutGet
} = require("../controller/userController")
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy

const router = new Router();

router.get('/new', newUserGet);
router.post('/new', newUserPost);
router.get('/login', loginGet);
router.post('/login', 
    passport.authenticate("local", {
        successRedirect:'/dash',
        failureRedirect:'/notfound'
    }) 
);
router.get('/logout', logoutGet);

module.exports = router;