// test/routes/movies.test.ts
import request from "supertest";
import app from "../../src/app"; // 你的 Koa app
import jwt from "jsonwebtoken";

const SECRET_KEY = "your_secret_key"; // 與 authMiddleware 相同

// 建立測試用 JWT
const testToken = jwt.sign({ id: 1, username: "admin" }, SECRET_KEY, {
  expiresIn: "1h",
});

describe("Movies API", () => {
  // 1. 未登入 GET 成功
  it("should GET movies without login", async () => {
    const res = await request(app.callback()).get("/api/v1/movies");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  // 2. 登入後 POST 成功
  it("should POST movie with JWT", async () => {
    const res = await request(app.callback())
      .post("/api/v1/movies")
      .set("Authorization", `Bearer ${testToken}`)
      .send({ title: "Test Movie", genre: "Action", year: 2026, rating: 8.5 });

    expect(res.status).toBe(201);
    expect(res.body.title).toBe("Test Movie");
  });

  // 3. 未登入 POST → 401
  it("should reject POST movie without JWT", async () => {
    const res = await request(app.callback())
      .post("/api/v1/movies")
      .send({ title: "No Token Movie", genre: "Drama", year: 2026, rating: 7.0 });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Missing token");
  });

  // 4. 登入後 PUT 成功
  it("should PUT movie with JWT", async () => {
    const res = await request(app.callback())
      .put("/api/v1/movies/1")
      .set("Authorization", `Bearer ${testToken}`)
      .send({ title: "Updated Movie", rating: 9.0 });

    expect(res.status).toBe(201);
    expect(res.body.title).toBe("Updated Movie");
  });

  // 5. 未登入 PUT → 401
  it("should reject PUT movie without JWT", async () => {
    const res = await request(app.callback())
      .put("/api/v1/movies/1")
      .send({ title: "Fail Update" });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Missing token");
  });

  // 6. 登入後 DELETE 成功
  it("should DELETE movie with JWT", async () => {
    const res = await request(app.callback())
      .delete("/api/v1/movies/1")
      .set("Authorization", `Bearer ${testToken}`);

    expect(res.status).toBe(201);
    expect(res.body.message).toContain("Removed movie");
  });

  // 7. 未登入 DELETE → 401
  it("should reject DELETE movie without JWT", async () => {
    const res = await request(app.callback()).delete("/api/v1/movies/1");
    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Missing token");
  });
});
