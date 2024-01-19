const db = require("../db/connection");
exports.selectAllTopics = () => {
  return db.query(`SELECT * FROM topics`).then((topic) => {
    return topic.rows;
  });
};

exports.selectAnArticle = (id) => {
  queries = [];
  let queryString = ` SELECT articles.author, title, articles.article_id, articles.body, topic, articles.created_at, articles.votes, article_img_url,
  (SELECT COUNT(*) FROM comments WHERE comments.article_id = articles.article_id) AS comment_count 
  FROM articles
  LEFT JOIN comments ON articles.article_id = comments.article_id WHERE articles.article_id = $1`;
  queries.push(id);
  return db.query(queryString, queries).then((article) => {
    if (article.rows.length === 0) {
      return Promise.reject({
        status: 404,
        msg: "Not found.",
      });
    } else return article.rows[0];
  });
};

exports.selectAllArticles = (topic, sort_by = "created_at", order = "desc") => {
  let queries = [];
  const validSortBy = ["title", "topic", "author", "created_at", "votes"];
  const validOrder = ["asc", "desc"];
  if (!validOrder.includes(order)) {
    return Promise.reject({
      status: 400,
      msg: "Wrong input",
    });
  }
  if (!validSortBy.includes(sort_by)) {
    return Promise.reject({
      status: 400,
      msg: "Wrong input",
    });
  }
  let queryString = `SELECT articles.article_id, title, topic, articles.author, articles.created_at, articles.votes, article_img_url,CAST(COUNT(comment_id) AS INTEGER) AS comment_count FROM articles 
  LEFT JOIN comments ON articles.article_id = comments.article_id `;

  if (topic) {
    queryString += ` WHERE topic = $1 `;
    queries.push(topic);
  }

  queryString += ` GROUP BY articles.article_id
  ORDER BY ${sort_by} ${order}`;

  return db.query(queryString, queries).then((article) => {
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
  let queries = [];
  let queryString = `SELECT * FROM comments WHERE article_id=$1 ORDER BY created_at DESC;`;
  queries.push(article_id);
  return db
    .query(queryString, queries)
    .then((comment) => {
      return comment.rows;
    })
    .catch((err) => {
      next(err);
    });
};

exports.checkArticleExists = (article_id) => {
  let queries = [];
  let queryString = `SELECT * FROM comments WHERE article_id=$1 ORDER BY created_at DESC`;
  queries.push(article_id);
  return db.query(queryString, queries).then((article) => {
    if (article.rows.length === 0) {
      return Promise.reject({
        status: 404,
        msg: "Not found",
      });
    }
  });
};

exports.insertCommentById = (article_id, username, body) => {
  let queries = [];
  let queryString = `INSERT INTO comments(article_id,body,author) VALUES ($1,$2,$3) returning *`;
  queries.push(article_id, body, username);
  return db
    .query(queryString, queries)
    .then((comment) => {
      if (comment.rows.length === 0) {
        return Promise.reject({ status: 400, msg: "Wrong input" });
      }
      return comment.rows[0];
    })
    .catch();
};

exports.updateArticleById = (article_id, inc_votes) => {
  return db
    .query("SELECT votes FROM articles WHERE article_id = $1", [article_id])
    .then((article) => {
      if (article.rows.length == 0) {
        return Promise.reject({ status: 404, msg: "Not found" });
      }
      const newVotes = article.rows[0].votes + inc_votes;
      return db.query(
        `UPDATE articles
      SET votes = $1
      WHERE article_id = $2
      RETURNING *`,
        [newVotes, article_id]
      );
    })
    .then((article) => {
      return article.rows[0];
    });
};

exports.removeCommentById = (comment_id) => {
  return db
    .query(`DELETE FROM comments WHERE comment_id=$1 returning *`, [comment_id])
    .then((comment) => {
      if (comment.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not found" });
      } else {
        return comment.rows[0];
      }
    });
};

exports.selectUsers = () => {
  return db
    .query(
      `
  SELECT * FROM users`
    )
    .then((users) => {
      return users.rows;
    });
};

exports.checkUsernameExists = (username) => {
  let queries = [];
  let queryString = `SELECT * FROM users WHERE username=$1`;
  queries.push(username);
  return db.query(queryString, queries).then((username) => {
    if (username.rows.length === 0) {
      return Promise.reject({ status: 404, msg: "Not found" });
    }
  });
};
