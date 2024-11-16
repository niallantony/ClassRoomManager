const passport = require("passport");
const { User } = require("../model/query");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs")


passport.use(
    new LocalStrategy(
        {
            usernameField:"email",
        },
        async (email, password, done) => {
        try {
            const db = User();
            const user = await db.queryEmail(email);
            if (!user) {
                return done(null, false, {message: "Incorrect username"});
            }
            const match = await bcrypt.compare(password, user.password);
            if (!match) {
                return done(null, false, {message: "Incorrect password"});
            }
            return done(null, user);
        } catch(err) {
            done(err);
        }
    })
)

passport.serializeUser((user, done) => {
    done(null, user.teacher_id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const db = User();
        const user = await db.queryId(id);
        done (null, user);
    } catch(err) {
        done(err); 
    }
})
