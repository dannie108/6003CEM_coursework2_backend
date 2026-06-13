// middleware/authMiddleware.ts
import { RouterContext } from "koa-router";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key"; // 建議放到環境變數

// 基本 JWT 驗證 middleware
export const authMiddleware = async (ctx: RouterContext, next: any) => {
  const authHeader = ctx.headers["authorization"];
  if (!authHeader) {
    ctx.status = 401;
    ctx.body = { message: "Missing token" };
    return;
  }

  const token:any = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    ctx.state.user = decoded; // 把解碼後的使用者資訊放到 ctx.state
    await next();
  } catch (err) {
    ctx.status = 403;
    ctx.body = { message: "Invalid token" };
  }
};
