const { Router } = require("express");
const { 
    newUserGet, 
    newUserPost,
    loginGet,
    loggedInGet,
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
        failureRedirect:'/no'
    }) 
);
router.get('/logout', logoutGet);

module.exports = router;