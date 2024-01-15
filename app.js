const express = require("express");
const { getAllTopics } = require("./controllers/app.controller");
const apiRouter = require('./routes/api.router');
const app = express();
app.use(express.json());

app.get("/api/topics", getAllTopics);

app.use("/api", apiRouter);

module.exports = app;
