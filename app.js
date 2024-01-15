const express = require("express");
const {
  getAllTopics,
  getAnArticle,
  getAllArticles,
} = require("./controllers/app.controller");

const { getAPIEndPoints } = require("./controllers/api.controller");

const app = express();

app.use(express.json());

app.get("/api/topics", getAllTopics);

app.get("/api/articles/:article_id", getAnArticle);

app.get("/api/articles", getAllArticles);

app.get("/api", getAPIEndPoints);

app.use((err, req, res, next) => {
  res.status(404).send({ msg: "Article not found" });
});

module.exports = app;
