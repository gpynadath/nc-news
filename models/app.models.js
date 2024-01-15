const db = require("../db/connection");
exports.selectAllTopics = () => {
  console.log("models");
  return db.query(`SELECT * FROM topics`).then((data)=>{
    return data.rows
  });
};
