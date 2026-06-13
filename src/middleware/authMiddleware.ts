// middleware/authMiddleware.ts
// JWT 驗證中介層
import { RouterContext } from "koa-router";
import jwt from "jsonwebtoken";

const SECRET_KEY = "your_secret_key"; // 建議放到 config.ts

export const authMiddleware = async (ctx: RouterContext, next: any) => {
  // 從 header 取出 Authorization 欄位
  const authHeader = ctx.headers["authorization"];
  if (!authHeader) {
    ctx.status = 401;
    ctx.body = { message: "Missing token" }; // 英文訊息
    return;
  }

  // 拆解 Bearer token
  const token:any = authHeader.split(" ")[1];
  try {
    // 驗證 token
    const decoded = jwt.verify(token, SECRET_KEY);
    ctx.state.user = decoded; // 把解碼後的使用者資訊放到 ctx.state
    await next(); // 繼續執行後續路由
  } catch (err) {
    ctx.status = 403;
    ctx.body = { message: "Invalid token" }; // 英文訊息
  }
};
