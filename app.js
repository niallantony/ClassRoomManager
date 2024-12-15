require("dotenv").config();
const express = require("express");
const path = require("node:path");
const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;
const session = require("express-session");
const pool = require('./model/pool');
const cors = require('cors');


//Routers
const userRouter = require('./routes/userRouter');
const indexRouter = require('./routes/indexRouter');
const subjectRouter = require('./routes/subjectRouter');
const lessonRouter = require('./routes/lessonRouter');
const studentRouter = require('./routes/studentRouter');

const app = express();

process.on('uncaughtException', (err) => {
    console.log(err);
})

app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))
app.use(express.json());
app.use(session({
    store: new (require('connect-pg-simple')(session))({
        pool: pool,
    }),
    saveUninitialized:false,
    secret: process.env.COOKIE_SECRET,
    resave: false,
    cookie: { 
        maxAge: 30 * 24 * 60 * 60 * 1000,
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        sameSite: 'lax',
     }  // 30 Days
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


app.use('/', indexRouter)
app.use('/user', userRouter);
app.use('/subjects', subjectRouter);
app.use('/lessons', lessonRouter);
app.use('/students', studentRouter);
app.use((req, res) => {
    res.status(404).send({title:"404", content:"partials/404"})
})


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Classroom Manager - listening on port ${PORT}`);
})