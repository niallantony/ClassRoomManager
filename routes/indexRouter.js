const { Router } = require("express");
const { 
    getIndex,
    getDash,
} = require('../controller/indexController')

const indexRouter = Router();

indexRouter.get('/', [getDash, getIndex]);
indexRouter.get('/dash', [getDash, getIndex]);

module.exports = indexRouter;