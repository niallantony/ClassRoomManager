const { Router } = require("express");
const { 
    getIndex,
    getDash,
} = require('../controller/indexController')

const indexRouter = Router();

const authenticateUser = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    } else {
        return res.status(401).send({message: 'Unauthorised'});
    }
};

indexRouter.get('/', [authenticateUser,getDash, getIndex]);
indexRouter.get('/dash', [authenticateUser,getDash, getIndex]);

module.exports = indexRouter;