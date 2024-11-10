require("dotenv").config();
const express = require("express");
const path = require("node:path");
const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;
const session = require("express-session");
const pool = require('./model/pool');


//Routers
const userRouter = require('./routes/userRouter');
const indexRouter = require('./routes/indexRouter');
const subjectRouter = require('./routes/subjectRouter');

const app = express();
const assetsPath = path.join(__dirname, "public");

process.on('uncaughtException', (err) => {
    console.log(err);
})

app.use(express.urlencoded({extended:true}));
app.use(express.static(assetsPath));
app.use(session({
    store: new (require('connect-pg-simple')(session))({
        pool: pool,
    }),
    secret: process.env.COOKIE_SECRET,
    resave: false,
    cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 }  // 30 Days
}));

require('./configs/passport');
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    if (req.user) {
        res.locals.user = req.user;
    } else {
        res.locals.user = null;
    }
    next();
})

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use('/', indexRouter)
app.use('/user', userRouter);
app.use('/subjects', subjectRouter);
app.use((req, res) => {
    res.status(404).render('layout', {title:"404", content:"partials/404"})
})


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Classroom Manager - listening on port ${PORT}`);
})