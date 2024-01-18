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
        status: 404,
        msg: "Not found.",
      });
    } else return data.rows[0];
  });
};

exports.selectAllArticles = (topic) => {
  let queryString = `SELECT articles.article_id, title, topic, articles.author, articles.created_at, articles.votes, article_img_url,CAST(COUNT(comment_id) AS INTEGER) AS comment_count FROM articles 
  LEFT JOIN comments ON articles.article_id = comments.article_id `;

  if (topic) {
    queryString += ` WHERE topic = '${topic}' `;
  }

  queryString += ` GROUP BY articles.article_id
  ORDER BY articles.created_at DESC`;
  
  return db.query(queryString).then((article) => {
    if (article.rows.length === 0) {
      return Promise.reject({
        status: 404,
        msg: "Not found",
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
      return data.rows;
    })
    .catch((err) => {});
};

exports.checkArticleExists = (article_id) => {
  return db
    .query(
      `SELECT * FROM comments WHERE article_id=${article_id} ORDER BY created_at DESC;`
    )
    .then((data) => {
      if (data.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "Not found",
        });
      }
    });
};

exports.insertCommentById = (article_id, username, body) => {
  return db
    .query(
      `INSERT INTO comments(article_id,body,author) VALUES (${article_id},'${body}','${username}') returning *`
    )
    .then((data) => {
      return data.rows[0];
    })
    .catch((err) => {});
};

exports.updateArticleById = (article_id, inc_votes) => {
  return db
    .query("SELECT votes FROM articles WHERE article_id = $1", [article_id])
    .then((data) => {
      if (data.rows.length == 0) {
        return Promise.reject({ status: 404, msg: "Not found" });
      }
      const newVotes = data.rows[0].votes + inc_votes;
      return db.query(
        `UPDATE articles
      SET votes = $1
      WHERE article_id = $2
      RETURNING *`,
        [newVotes, article_id]
      );
    })
    .then((data) => {
      return data.rows[0];
    });
};

exports.removeCommentById = (comment_id) => {
  return db
    .query(`DELETE FROM comments WHERE comment_id=$1 returning *`, [comment_id])
    .then((data) => {
      if (data.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not found" });
      } else {
        return data.rows[0];
      }
    });
};

exports.selectUsers = () => {
  return db
    .query(
      `
  SELECT * FROM users`
    )
    .then((data) => {
      return data.rows;
    });
};
