const db = require("../db/connection");
exports.selectAllTopics = () => {
  return db.query(`SELECT * FROM topics`).then((data) => {
    return data.rows;
  });
};

exports.selectAnArticle = (id) => {
  console.log("models"+id);
  return db
    .query(`SELECT * FROM articles WHERE article_id=${id}`)
    .then((data) => {
      return data.rows[0];
    });
};
