const express = require("express");
const { getAllTopics, getAnArticle } = require("./controllers/app.controller");

const { getAPIEndPoints } = require("./controllers/api.controller");

const app = express();

app.get("/api/topics", getAllTopics);

app.get("/api/articles/:article_id", getAnArticle);

app.get("/api", getAPIEndPoints);



module.exports = app;   