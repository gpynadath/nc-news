const express = require("express");
const {
  getAllTopics,
  getAnArticle,
  getAllArticles,
  getCommentsById,
  postCommentsById,
} = require("./controllers/app.controller");

const { getAPIEndPoints } = require("./controllers/api.controller");

const app = express();

app.get("/api/topics", getAllTopics);

app.get("/api/articles/:article_id", getAnArticle);

app.get("/api/articles", getAllArticles);

app.get("/api/articles/:article_id/comments", getCommentsById);

app.get("/api", getAPIEndPoints);

app.post("/api/articles/:article_id/comments",postCommentsById)

app.use((err, req, res, next) => {
  res.status(404).send({ msg: "Item not found" });
  
});
app.use((err, req, res, next) => {
  if (err.code === "22P02" || err.code === "23502") {
    res.status(400).send({ msg: "Bad path" });
  } else {
    next(err);
  }
});

module.exports = app;
