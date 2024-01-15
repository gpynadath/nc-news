const { selectAllTopics } = require("../models/app.models");

exports.getAllTopics = (req, res, next) => {
  selectAllTopics().then((data) => {
    
    res.status(200).send({data});
  });
};


