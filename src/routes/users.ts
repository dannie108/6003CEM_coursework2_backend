import Router, { RouterContext } from "koa-router";
import bodyParser from "koa-bodyparser";
import * as model from "../models/users";
import * as db from "../helpers/database";
import { register, login } from "../controllers/auth"; 
import { authMiddleware } from "../middleware/authMiddleware"; 
import { validateUser } from "../middleware/validation"; 

const router = new Router({ prefix: "/api/v1/users" });

// -------------------- User Info --------------------
const getMe = async (ctx: RouterContext) => {
  let userId = Number(ctx.state.user?.id);
  if (!userId || isNaN(userId)) {
    userId = Number(ctx.query.userId);
  }

  if (!userId || isNaN(userId)) {
    ctx.status = 401;
    ctx.body = { err: "Invalid user session" };
    return;
  }

  try {
    const user = await model.getById(userId);   
    if (user && user.length > 0) {
      ctx.body = user[0];
    } else {
      ctx.status = 404;
      ctx.body = { err: "User not found" };
    }
  } catch (err) {
    console.error("Get me error:", err);
    ctx.status = 500;
    ctx.body = { err: "Database error" };
  }
};

const getAll = async (ctx: RouterContext) => {
  const users = await model.getAll();
  ctx.body = users.length ? users : {};
};

const getById = async (ctx: RouterContext) => {
  let id = Number(ctx.params.id);


  if (!id || isNaN(id)) {
    id = Number(ctx.state.user?.id || ctx.query.userId);
  }

  const users = await model.getById(id);
  if (!Number.isInteger(id) || id <= 0 || !users.length) {
    ctx.status = 400;
    ctx.body = "Invalid ID";
  } else {
    ctx.body = users[0];
  }
};

const updateUser = async (ctx: RouterContext) => {
  let id = Number(ctx.params.id);
  if (!id || isNaN(id)) {
    id = Number(ctx.state.user?.id || (ctx.request.body as { userId?: number }).userId);
  }

  const body = ctx.request.body;
  const result = await model.update(id, body);
  if (result.status == 201) {
    ctx.status = 201;
    ctx.body = body;
  } else {
    ctx.status = 500;
    ctx.body = { err: "update data failed" };
  }
};

const deleteUser = async (ctx: RouterContext) => {
  let id = Number(ctx.params.id);
  if (!id || isNaN(id)) {
    id = Number(ctx.state.user?.id || (ctx.request.body as { userId?: number }).userId);
  }

  const result = await model.del(id);
  if (result.status == 201) {
    ctx.status = 201;
    ctx.body = { message: "Removed user " + id };
  } else {
    ctx.status = 500;
    ctx.body = { err: "delete data failed" };
  }
};

// -------------------- Watchlist / Watched --------------------
const addToWatchlist = async (ctx: RouterContext) => {
  const { movieId, userId: bodyUserId } = ctx.request.body as { movieId: number; userId?: number };

  if (!movieId || isNaN(Number(movieId))) {
    ctx.status = 400;
    ctx.body = { error: "movieId is required and must be a number" };
    return;
  }

  let userId = Number(ctx.state.user?.id);
  if (!userId || isNaN(userId)) {
    userId = Number(bodyUserId);
  }

  if (!userId || isNaN(userId)) {
    ctx.status = 401;
    ctx.body = { error: "Unauthorized: invalid user id" };
    return;
  }

  try {
    await db.run_insert(
      "INSERT INTO user_movie_status (user_id, movie_id, status) VALUES (?, ?, ?)",
      [userId, movieId, "watchlist"]
    );
    ctx.body = { success: true };
  } catch (err) {
    ctx.status = 400;
    ctx.body = { error: "Already in watchlist or DB error" };
  }
};

const getWatchlist = async (ctx: RouterContext) => {
  let userId = Number(ctx.state.user?.id);
  if (!userId || isNaN(userId)) {
    userId = Number(ctx.query.userId);
  }

  if (!userId || isNaN(userId)) {
    ctx.status = 400;
    ctx.body = { error: "Invalid user id" };
    return;
  }

  const movies = await db.run_query(
    `SELECT m.* 
     FROM user_movie_status ums 
     JOIN movies m ON ums.movie_id = m.id 
     WHERE ums.user_id = ? AND ums.status = ?`,
    [userId, "watchlist"]
  );
  ctx.body = movies;
};

const addToWatched = async (ctx: RouterContext) => {
  const { movieId, userId: bodyUserId } = ctx.request.body as { movieId: number; userId?: number };

  if (!movieId || isNaN(Number(movieId))) {
    ctx.status = 400;
    ctx.body = { error: "movieId is required and must be a number" };
    return;
  }

  let userId = Number(ctx.state.user?.id);
  if (!userId || isNaN(userId)) {
    userId = Number(bodyUserId);
  }

  if (!userId || isNaN(userId)) {
    ctx.status = 401;
    ctx.body = { error: "Unauthorized: invalid user id" };
    return;
  }

  try {
    await db.run_insert(
      "INSERT INTO user_movie_status (user_id, movie_id, status) VALUES (?, ?, ?)",
      [userId, movieId, "watched"]
    );
    ctx.body = { success: true };
  } catch (err) {
    ctx.status = 400;
    ctx.body = { error: "Already marked watched or DB error" };
  }
};

const getWatched = async (ctx: RouterContext) => {
  let userId = Number(ctx.state.user?.id);
  if (!userId || isNaN(userId)) {
    userId = Number(ctx.query.userId);
  }

  if (!userId || isNaN(userId)) {
    ctx.status = 400;
    ctx.body = { error: "Invalid user id" };
    return;
  }

  const movies = await db.run_query(
    `SELECT m.* 
     FROM user_movie_status ums 
     JOIN movies m ON ums.movie_id = m.id 
     WHERE ums.user_id = ? AND ums.status = ?`,
    [userId, "watched"]
  );
  ctx.body = movies;
};

// -------------------- Routes --------------------
router.post("/register", bodyParser(), register);
router.post("/login", bodyParser(), login);
router.get("/me", authMiddleware, getMe);
router.get("/", authMiddleware, getAll);
router.get("/:id", authMiddleware, getById);
router.put("/:id", authMiddleware, bodyParser(), validateUser, updateUser);
router.delete("/:id", authMiddleware, deleteUser);

router.get("/watchlist", authMiddleware, getWatchlist);
router.get("/watched", authMiddleware, getWatched);

router.post("/watched", authMiddleware, bodyParser(), addToWatched);
router.post("/watchlist", authMiddleware, bodyParser(), addToWatchlist);

export { router };
