const { Router } = require("express");
const { newUserPost, logoutGet } = require("../controller/userController");
const passport = require("passport");

const router = new Router();

router.post("/new", newUserPost);
router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return res.status(500).json({ error: "Server Error" });
    if (!user) return res.status(401).json({ error: info.message });

    req.login(user, (err) => {
      if (err) return res.status(500).json({ error: "Login Failed" });
      return res.json({ message: "login successful", user });
    });
  })(req, res, next);
});
router.get("/logout", logoutGet);

module.exports = router;

