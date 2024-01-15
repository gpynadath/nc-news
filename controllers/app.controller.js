const { selectAllTopics, selectAnArticle } = require("../models/app.models");

exports.getAllTopics = (req, res, next) => {
  selectAllTopics().then((data) => {
    
    res.status(200).send({ data });
  });
};

exports.getAnArticle = (req,res,next) => {
  
  
  const {article_id}=req.params
  
  selectAnArticle(article_id).then((data) => {
    res.status(200).send({ data });
  });
};
