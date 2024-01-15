const {
  selectAllTopics,
  selectAllArticles,
  selectAnArticle,
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
    .then((data) => {
      console.log(data);
      res.status(200).send({ data });
    })
    .catch((err) => {
      next(err);
    });
};
