const {
  selectAllTopics,
  selectAllArticles,
  selectAnArticle,
  selectCommentsById,
  checkArticleExists,
} = require("../models/app.models");

exports.getAllTopics = (req, res, next) => {
  selectAllTopics().then((data) => {
    res.status(200).send({ data });
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
  insertCommentById(article_id)
};
