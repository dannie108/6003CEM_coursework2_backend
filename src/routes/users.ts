// routes/users.ts
// 使用者相關路由：註冊、登入、CRUD
import Router, { RouterContext } from "koa-router";
import bodyParser from "koa-bodyparser";
import * as model from "../models/users";
import { register, login } from "../controllers/auth"; // 新增 register/login controller
import { authMiddleware } from "../middleware/authMiddleware"; // JWT 驗證
import { validateUser } from "../middleware/validation"; // 驗證使用者資料


const router = new Router({ prefix: "/api/v1/users" });

// 取得目前登入使用者資訊
const getMe = async (ctx: RouterContext, next: any) => {
  const username = ctx.state.user?.username;
  if (!username) {
    ctx.status = 400;
    ctx.body = { err: "No username in state" };
    return;
  }

  const user = await model.findByUsername(username);
  if (user.length) {
    ctx.body = user[0];
  } else {
    ctx.body = {};
  }
  await next();
};

// 取得所有使用者
const getAll = async (ctx: RouterContext, next: any) => {
  const users = await model.getAll();
  ctx.body = users.length ? users : {};
  await next();
};

// 依 ID 取得使用者
const getById = async (ctx: RouterContext, next: any) => {
  const id = Number(ctx.params.id);
  const users = await model.getById(id);
  if (!Number.isInteger(id) || id <= 0 || !users.length) {
    ctx.status = 400;
    ctx.body = "Invalid ID";
  } else {
    ctx.body = users[0];
  }
  await next();
};

// 更新使用者 (需 JWT + validateUser)
router.put("/:id", authMiddleware, bodyParser(), validateUser, async (ctx, next) => {
  const id = Number(ctx.params.id);
  const body = ctx.request.body;
  const result = await model.update(id, body);
  if (result.status == 201) {
    ctx.status = 201;
    ctx.body = body;
  } else {
    ctx.status = 500;
    ctx.body = { err: "update data failed" };
  }
  await next();
});

// 刪除使用者 (需 JWT)
router.delete("/:id", authMiddleware, async (ctx, next) => {
  const id = Number(ctx.params.id);
  const result = await model.del(id);
  if (result.status == 201) {
    ctx.status = 201;
    ctx.body = { message: "Removed user " + id };
  } else {
    ctx.status = 500;
    ctx.body = { err: "delete data failed" };
  }
  await next();
});


// 新增使用者 (註冊流程用 register controller)
router.post("/register", bodyParser(), register);
// 登入使用者 (login controller)
router.post("/login", bodyParser(), login);
// 取得目前登入使用者
router.get("/me", authMiddleware, getMe);
// 取得所有使用者 (需 JWT)
router.get("/", authMiddleware, getAll);
// 依 ID 取得使用者 (需 JWT)
router.get("/:id", authMiddleware, getById);


export { router };
