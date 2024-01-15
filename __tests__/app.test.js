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
        console.log(topics.data);
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
        console.log(apis);
        expect(apis).toEqual(endpoints);
      });
  });
});
