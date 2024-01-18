const express = require("express");
const {
  getAllTopics,
  getAnArticle,
  getAllArticles,
  getCommentsById,
  postCommentsById,
  patchArticleById,
  deleteCommentsById,
  getUsers,
  getArticleByQuery,
} = require("./controllers/app.controller");

const { getAPIEndPoints } = require("./controllers/api.controller");

const app = express();

app.use(express.json());

app.get("/api/topics", getAllTopics);

app.get("/api/articles/:article_id", getAnArticle);

app.get("/api/articles", getAllArticles);

app.get("/api/articles/:article_id/comments", getCommentsById);

app.get("/api", getAPIEndPoints);

app.post("/api/articles/:article_id/comments", postCommentsById);

app.patch("/api/articles/:article_id", patchArticleById);

app.delete("/api/comments/:comment_id", deleteCommentsById);

app.get("/api/users", getUsers);



app.use((err, req, res, next) => {
  if (err.msg === "Not found") {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  res.status(400).send({ msg: "Wrong input" });
});

module.exports = app;
