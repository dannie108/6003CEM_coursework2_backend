// src/controllers/auth.ts
import { RouterContext } from "koa-router";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import * as users from "../models/users";

const SECRET_KEY = "your_secret_key"; // 建議放到 config.ts

// 註冊新使用者
export const register = async (ctx: RouterContext, next: any) => {
  const { username, password } = ctx.request.body as { username: string; password: string };
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await users.add({ username, password: hashedPassword });
    ctx.status = 201;
    ctx.body = { message: "Registration successful" };
  } catch (error) {
    ctx.status = 500;
    ctx.body = { message: "Error during registration" };
  }

  await next();
};

// 使用者登入
export const login = async (ctx: RouterContext, next: any) => {
  const { username, password } = ctx.request.body as { username: string; password: string };
  const result = await users.findByUsername(username);

  if (!result.length) {
    ctx.status = 401;
    ctx.body = { message: "User not found" };
    return;
  }

  const user = result[0] as { id: number; username: string; password: string };
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    ctx.status = 401;
    ctx.body = { message: "Incorrect password" };
    return;
  }

  const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, {
    expiresIn: "1h",
  });

  ctx.body = { token };
  await next();
};
