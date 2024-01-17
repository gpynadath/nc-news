const request = require("supertest");
const app = require("../app");
const testData = require("../db/data/test-data");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");

const endpoints = require("../endpoints.json");

beforeEach(() => seed(testData));
afterAll(() => {
  return db.end();
});

describe("GET /api/topics", () => {
  test("returns topics with correct properties", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((response) => {
        const topics = response.body;
        expect(topics.data.length).toBeGreaterThan(0);
        topics.data.forEach((topic) => {
          expect(typeof topic.slug).toBe("string");
          expect(typeof topic.description).toBe("string");
        });
      });
  });
});

describe("GET /api", () => {
  test("returns object with all API endpoints", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((response) => {
        const apis = response.body;

        expect(apis).toEqual(endpoints);
      });
  });
});

describe("GET /articles/2", () => {
  test("returns an article object", () => {
    return request(app)
      .get("/api/articles/2")
      .expect(200)
      .then((response) => {
        const article = response.body.data;
        expect(typeof article.author).toBe("string");
        expect(typeof article.title).toBe("string");
        expect(typeof article.article_id).toBe("number");
        expect(typeof article.body).toBe("string");
        expect(typeof article.topic).toBe("string");
        expect(typeof article.created_at).toBe("string");
        expect(typeof article.votes).toBe("number");
        expect(typeof article.article_img_url).toBe("string");
      });
  });
  test("returns error an on invalid article id", () => {
    return request(app)
      .get("/api/articles/999")
      .expect(404)
      .then((response) => {
        expect(response.body).toEqual({ msg: "Item not found" });
      });
  });
});

describe("GET /api/articles", () => {
  test("returns array of article objects", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        const articles = response.body;
        expect(articles.article.length).toBeGreaterThan(0);
        articles.article.forEach((article) => {
          expect(typeof article.author).toBe("string");
          expect(typeof article.title).toBe("string");
          expect(typeof article.article_id).toBe("number");
          expect(typeof article.topic).toBe("string");
          expect(typeof article.created_at).toBe("string");
          expect(typeof article.votes).toBe("number");
          expect(typeof article.article_img_url).toBe("string");
          expect(typeof article.comment_count).toBe("number");
        });
      });
  });
});

describe("GET /api/articles/3/comments", () => {
  test("returns array of comments of  Article 3", () => {
    return request(app)
      .get("/api/articles/3/comments")
      .expect(200)
      .then((response) => {
        const comments = response.body.comments;
        expect(comments.length).toBeGreaterThan(0);
        comments.forEach((comment) => {
          expect(typeof comment.author).toBe("string");
          expect(typeof comment.comment_id).toBe("number");
          expect(typeof comment.article_id).toBe("number");
          expect(typeof comment.created_at).toBe("string");
          expect(typeof comment.votes).toBe("number");
          expect(typeof comment.body).toBe("string");
        });
      });
  });
  test("returns error when given valid but non existent id", () => {
    return request(app)
      .get("/api/articles/50/comments")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Item not found");
      });
  });
  // test("returns error when given an invalid id", () => {
  //   return request(app)
  //     .get("/api/articles/cars/comments")
  //     .expect(400)
  //     .then((response) => {
  //       console.log(response);
  //       expect(response.msg).toBe("Bad Path");
  //     });
  // });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("Post a comment", () => {
    const newComment = {
      username: "test",
      body: "Lorem ipsum",
    };
    return request(app)
      .post("/api/articles/3/comments")
      .send(newComment)
      .expect(201)
      .then((response) => {
        const comment = response.body.comment;
        expect(comment.username).toBe("test");
        expect(comment.body).toBe("Lorem ipsum");
      });
  });
});
