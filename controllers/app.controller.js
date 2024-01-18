const {
  selectAllTopics,
  selectAllArticles,
  selectAnArticle,
  selectCommentsById,
  checkArticleExists,
  insertCommentById,
  checkUsernameExists,
  updateArticleById,
  removeCommentById,
  
} = require("../models/app.models");

exports.getAllTopics = (req, res, next) => {
  selectAllTopics()
    .then((data) => {
      res.status(200).send({ data });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getAnArticle = (req, res, next) => {
  const { article_id } = req.params;

  selectAnArticle(article_id)
    .then((data) => {
      res.status(200).send({ data });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getAllArticles = (req, res, next) => {
  selectAllArticles()
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getCommentsById = (req, res, next) => {
  const { article_id } = req.params;
  checkArticleExists(article_id)
    .then()
    .catch((err) => {
      next(err);
    });
  selectCommentsById(article_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postCommentsById = (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;
  if (!username || !body) {
    res.status(404).send({ msg: "Not found" });
  }
  const length = Object.keys(req.body).length;

  if (length > 2) {
    res.status(400).send({ msg: "Bad request" });
  }

  insertCommentById(article_id, username, body)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchArticleById = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  updateArticleById(article_id, inc_votes)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.deleteCommentsById = (req, res, next) => {
  const { comment_id } = req.params;
  removeCommentById(comment_id)
    .then((data) => {
      res.status(204).send({ data });
    })
    .catch((err) => {
      next(err);
    });
};