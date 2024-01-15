const express = require("express");
const { getAllTopics } = require("./controllers/app.controller");

const { getAPIEndPoints } = require("./controllers/api.controller");

const app = express();

app.get("/api/topics", getAllTopics);

app.use("/api", getAPIEndPoints);

module.exports = app;
