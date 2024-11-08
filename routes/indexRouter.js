const { Router } = require("express");
const { 
    getIndex,
    get404,
} = require('../controller/indexController')

const indexRouter = Router();

indexRouter.get('/', getIndex);

module.exports = indexRouter;