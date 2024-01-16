const db = require("../db/connection");
exports.selectAllTopics = () => {
  return db.query(`SELECT * FROM topics`).then((data) => {
    return data.rows;
  });
};

exports.selectAnArticle = (id) => {
  let queryString = `SELECT * FROM articles`;
  if (id) {
    queryString += ` WHERE article_id=${id}`;
  }

  return db.query(queryString).then((data) => {
    if (data.rows.length === 0) {
      return Promise.reject({
        msg: "Article not found.",
      });
    } else return data.rows[0];
  });
};

exports.selectAllArticles = () => {
  return db
    .query(
      `SELECT articles.article_id, title, topic, articles.author, articles.created_at, articles.votes, article_img_url,CAST(COUNT(comment_id) AS INTEGER) AS comment_count FROM articles 
      LEFT JOIN comments ON articles.article_id = comments.article_id 
      GROUP BY articles.article_id
      ORDER BY articles.created_at DESC
  `
    )
    .then((article) => {
      if (article.rows.length === 0) {
        return Promise.reject({
          msg: "Bad request.",
        });
      } else {
        return article.rows;
      }
    });
};

exports.selectCommentsById = (article_id) => {
  return db
    .query(
      `SELECT * FROM comments WHERE article_id=${article_id} ORDER BY created_at DESC;`
    )
    .then((data) => {
      if (data.rows.length === 0) {
        return Promise.reject({
          msg: "Bad request",
        });
      } else {
        return data.rows;
      }
    });
};
