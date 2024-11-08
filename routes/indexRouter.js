const { Router } = require("express");
const { getIndex } = require('../controller/indexController')

const indexRouter = Router();

indexRouter.get('/', getIndex);

module.exports = indexRouter;