const { Router } = require("express");
const { newUserGet, newUserPost } = require("../controller/userController")

const router = new Router();

router.get('/new', newUserGet);
router.post('/new', newUserPost);

module.exports = router;