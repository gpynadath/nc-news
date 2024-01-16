const express = require("express");
const {
  getAllTopics,
  getAnArticle,
  getAllArticles,
  getCommentsById,
} = require("./controllers/app.controller");

const { getAPIEndPoints } = require("./controllers/api.controller");

const app = express();

app.get("/api/topics", getAllTopics);

app.get("/api/articles/:article_id", getAnArticle);

app.get("/api/articles", getAllArticles);

app.get("/api/articles/:article_id/comments", getCommentsById);

app.get("/api", getAPIEndPoints);

app.use((err, req, res, next) => {
  res.status(404).send({ msg: "Item not found" });
});

module.exports = app;
