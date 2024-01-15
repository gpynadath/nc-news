const { getAPIEndPoints } = require("../controllers/api.controller");

const apiRouter = require("express").Router();

apiRouter.route("/").get(getAPIEndPoints);

module.exports = apiRouter;
