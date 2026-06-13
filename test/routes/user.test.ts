// user.test.ts
// 測試使用者註冊與登入流程
import request from "supertest";
import app from "../src/app"; // 你的 Koa app

describe("User API", () => {
  // 測試註冊
  it("should register a new user", async () => {
    const res = await request(app.callback())
      .post("/api/v1/users/register")
      .send({ username: "testuser", password: "testpass" });

    expect(res.status).toBe(201);
    expect(res.body.message).toBe("Registration successful");
  });

  // 測試登入
  it("should login with correct credentials", async () => {
    const res = await request(app.callback())
      .post("/api/v1/users/login")
      .send({ username: "testuser", password: "testpass" });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
  });

  // 測試登入失敗
  it("should reject login with wrong password", async () => {
    const res = await request(app.callback())
      .post("/api/v1/users/login")
      .send({ username: "testuser", password: "wrongpass" });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Incorrect password");
  });
});
