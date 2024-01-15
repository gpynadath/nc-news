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
  test("returns an article object", () => {
    return request(app)
      .get("/api/articles/2")
      .expect(200)
      .then((response) => {
        const article = response.body.data;
        expect(article.hasOwnProperty("author")).toBe(true);
        expect(article.hasOwnProperty("title")).toBe(true);
        expect(article.hasOwnProperty("article_id")).toBe(true);
        expect(article.hasOwnProperty("body")).toBe(true);
        expect(article.hasOwnProperty("topic")).toBe(true);
        expect(article.hasOwnProperty("created_at")).toBe(true);
        expect(article.hasOwnProperty("votes")).toBe(true);
        expect(article.hasOwnProperty("article_img_url")).toBe(true);
      });
  });
});
