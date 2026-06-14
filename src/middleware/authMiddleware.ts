// src/middleware/authMiddleware.ts
import { RouterContext } from "koa-router";
import jwt from "jsonwebtoken";

const SECRET_KEY: string = process.env.JWT_SECRET || "your_secret_key";

interface CustomJwtPayload {
  id: number | string;
  username: string;
  role: string;
  iat?: number;
  exp?: number;
}

export const authMiddleware = async (ctx: RouterContext, next: any) => {
  const authHeader = ctx.headers["authorization"];
  if (!authHeader) {
    ctx.status = 401;
    ctx.body = { message: "Missing token" };
    return;
  }

  const token = authHeader.split(" ")[1] ?? "";
  if (!token) {
    ctx.status = 401;
    ctx.body = { message: "Token not provided" };
    return;
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);

    if (typeof decoded === "string") {
      ctx.status = 403;
      ctx.body = { message: "Invalid token" };
      return;
    }

    const { id, username, role } = decoded as CustomJwtPayload;

    if (!id || !username) {
      ctx.status = 403;
      ctx.body = { message: "Invalid token payload" };
      return;
    }


    const numericId = Number(id);
    if (Number.isNaN(numericId)) {
      ctx.status = 403;
      ctx.body = { message: "Invalid user ID in token" };
      return;
    }

    ctx.state.user = {
      id: numericId,
      username,
      role,
    };

    console.log("Decoded token payload:", decoded);
    console.log("ctx.state.user:", ctx.state.user);

    await next();
  } catch (err) {
    console.error("JWT verify error:", err);
    ctx.status = 403;
    ctx.body = { message: "Invalid token" };
  }
};
