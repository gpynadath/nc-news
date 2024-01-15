const { selectAllTopics } = require("../models/app.models");

exports.getAllTopics = (req, res, next) => {
  selectAllTopics().then((data) => {
    console.log("controller");
    res.status(200).send(data);
  });
};
