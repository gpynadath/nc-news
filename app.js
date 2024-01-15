const express = require("express");
const { getAllTopics } = require("./controllers/app.controller");
const app = express();
app.use(express.json());

app.get("/api/topics", getAllTopics);


module.exports = app;
