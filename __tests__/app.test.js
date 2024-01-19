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

describe("GET /articles/:article_id", () => {
  test("returns an object of article_id 3", () => {
    return request(app)
      .get("/api/articles/3")
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
      .expect(400)
      .then((response) => {
        expect(response.body).toEqual({ msg: "Wrong input" });
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
        expect(response.body.msg).toBe("Not found");
      });
  });
  test("returns 400 error when given an invalid id", () => {
    return request(app)
      .get("/api/articles/cars/comments")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Wrong input");
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("Post a comment", () => {
    const newComment = {
      username: "butter_bridge",
      body: "This article is a very nice article",
    };
    return request(app)
      .post("/api/articles/5/comments")
      .send(newComment)
      .expect(201)
      .then((response) => {
        const comment = response.body.comment;
        expect(comment.author).toBe("butter_bridge");
        expect(comment.body).toBe("This article is a very nice article");
        expect(comment.comment_id).toBe(19);
        expect(comment.article_id).toBe(5);
        expect(comment.votes).toBe(0);
        expect(typeof comment.created_at).toBe("string");
      });
  });
  test("returns 404 error when username invalid", () => {
    const newComment = {
      body: "Lorem ipsum",
    };
    return request(app)
      .post("/api/articles/3/comments")
      .send(newComment)
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Not found");
      });
  });
  test("returns 404 error when invalid id given", () => {
    const newComment = {
      username:"gp",
      body: "Lorem ipsum",
    };
    return request(app)
      .post("/api/articles/hello/comments")
      .send(newComment)
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Not found");
      });
  });
  test("returns 201 when given a too many key value pairs", () => {
    const newComment = {
      username: "butter_bridge",
      body: "Lorem ipsum",
      votes: 5,
    };
    return request(app)
      .post("/api/articles/3/comments")
      .send(newComment)
      .expect(201)
      .then((response) => {
        const comment = response.body.comment;
        expect(comment.author).toBe("butter_bridge");
        expect(comment.body).toBe("Lorem ipsum");
        expect(comment.comment_id).toBe(19);
        expect(comment.article_id).toBe(3);
        expect(comment.votes).toBe(0);
        expect(typeof comment.created_at).toBe("string");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("To update an article", () => {
    const updatedVote = { inc_votes: 3 };
    return request(app)
      .patch("/api/articles/3")
      .send(updatedVote)
      .expect(200)
      .then((response) => {
        const article = response.body.article;
        expect(article.title).toBe("Eight pug gifs that remind me of mitch");
        expect(article.topic).toBe("mitch");
        expect(article.body).toBe("some gifs");
        expect(article.votes).toBe(3);
        expect(article.article_img_url).toBe(
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
        );
      });
  });
  test("returns error 400 when inc_votes has wrong input type", () => {
    const updatedVote = { inc_votes: "cars" };
    return request(app)
      .patch("/api/articles/1")
      .send(updatedVote)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Wrong input");
      });
  });
  test("returns error 400 when path has wrong input type", () => {
    const updatedVote = { inc_votes: 1 };
    return request(app)
      .patch("/api/articles/hello")
      .send(updatedVote)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Wrong input");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("delete a comment", () => {
    return request(app)
      .delete("/api/comments/7")
      .expect(204)
      .then(() => {
        return request(app)
          .get("/api/articles/1/comments")
          .then((response) => {
            expect(response.body.comments.length).toBe(10);
          });
      });
  });
  test("return 404 error when deleting a non-existent id", () => {
    return request(app)
      .delete("/api/comments/999")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Not found");
      });
  });
  test("return 400 when id is not an integer", () => {
    return request(app)
      .delete("/api/comments/cars")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Wrong input");
      });
  });
});

describe("GET /api/users", () => {
  test("returns an array of all users", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then((response) => {
        const users = response.body.users;
        expect(Array.isArray(users)).toBe(true);
        expect(users.length).toBe(4);
        users.forEach((user) => {
          expect(typeof user.username).toBe("string");
          expect(typeof user.name).toBe("string");
          expect(typeof user.avatar_url).toBe("string");
        });
      });
  });
});

describe("GET /api/articles (topic query)", () => {
  test("returns an array of articles of the specified topic", () => {
    return request(app)
      .get("/api/articles?topic=mitch")
      .expect(200)
      .then((response) => {
        const articles = response.body.article;
        expect(articles.length).toBe(12);
        articles.forEach((article) => {
          expect(article.topic).toBe("mitch");
        });
      });
  });
  test("returns a 404 error when unknown topic passed", () => {
    return request(app)
      .get("/api/articles?topic=cars")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Not found");
      });
  });
});
describe("GET /articles/:article_id comment_count", () => {
  test("returns an object of article_id 3 with comment count included", () => {
    return request(app)
      .get("/api/articles/3")
      .expect(200)
      .then((response) => {
        const article = response.body.data;
        expect(article.hasOwnProperty("comment_count")).toBe(true);
      });
  });
});
