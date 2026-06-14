// src/controllers/auth.ts
import { RouterContext } from "koa-router";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import * as users from "../models/users";

const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";
// const ADMIN_SECRET_HASH = process.env.ADMIN_SECRET_HASH || ""; // admin key .env

// register
export const register = async (ctx: RouterContext, next: any) => {
  const { username, password, isAdmin, adminToken } = ctx.request.body as {
    username: string;
    password: string;
    isAdmin?: boolean;
    adminToken?: string;
  };

  const hashedPassword = await bcrypt.hash(password, 10);
  let role = "user";

  // if checked 'I am admin', check adminToken
  if (isAdmin) {
    const isValidAdmin = adminToken === "admin";
    // const isValidAdmin = await bcrypt.compare(adminToken || "", ADMIN_SECRET_HASH);

    if (isValidAdmin) {
      role = "admin";
    } else {
      ctx.status = 403;
      ctx.body = { message: "Invalid admin token" };
      return;
    }
  }

  try {
    await users.add({ username, password: hashedPassword, role });
    ctx.status = 201;
    ctx.body = { message: "Registration successful", role };
  } catch {
    ctx.status = 500;
    ctx.body = { message: "Error during registration" };
  }

  await next();
};

// login
export const login = async (ctx: RouterContext, next: any) => {
  const { username, password } = ctx.request.body as { username: string; password: string };
  const result = await users.findByUsername(username);

  if (!result) {
    ctx.status = 401;
    ctx.body = { message: "User not found" };
    return;
  }

  const user = result[0] as { id: number; username: string; password: string; role: string };
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    ctx.status = 401;
    ctx.body = { message: "Incorrect password" };
    return;
  }

  // login success → generate JWT
  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    SECRET_KEY,
    { expiresIn: "1h" }
  );

  ctx.body = { token, id: user.id, role: user.role };
  await next();
};
