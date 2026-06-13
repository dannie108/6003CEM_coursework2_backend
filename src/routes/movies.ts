// src/routes/movies.ts
import Router, { RouterContext } from "koa-router";
import bodyParser from "koa-bodyparser";
import * as model from "../models/movies";
import { authMiddleware } from "../middleware/authMiddleware";

const router = new Router({ prefix: "/api/v1/movies" });

// 取得所有電影
const getAllMovies = async (ctx: RouterContext, next: any) => {
  const movies = await model.getAll();
  ctx.body = movies.length ? movies : [];
  await next();
};

// 取得單一電影
const getMovieById = async (ctx: RouterContext, next: any) => {
  const id = Number(ctx.params.id);
  const movie = await model.getById(id);
  if (!movie.length) {
    ctx.status = 404;
    ctx.body = { error: "Movie not found" };
  } else {
    ctx.body = movie[0];
  }
  await next();
};

// 新增電影
const createMovie = async (ctx: RouterContext, next: any) => {
  const body = ctx.request.body;
  const result = await model.add(body);
  if (result.status === 201) {
    ctx.status = 201;
    ctx.body = body;
  } else {
    ctx.status = 500;
    ctx.body = { error: "Failed to add movie" };
  }
  await next();
};

// 更新電影
const updateMovie = async (ctx: RouterContext, next: any) => {
  const id = Number(ctx.params.id);
  const body = ctx.request.body;
  const result = await model.update(id, body);
  if (result.status === 201) {
    ctx.status = 201;
    ctx.body = body;
  } else {
    ctx.status = 500;
    ctx.body = { error: "Failed to update movie" };
  }
  await next();
};

// 刪除電影
const deleteMovie = async (ctx: RouterContext, next: any) => {
  const id = Number(ctx.params.id);
  const result = await model.del(id);
  if (result.status === 201) {
    ctx.status = 201;
    ctx.body = { message: `Removed movie ${id}` };
  } else {
    ctx.status = 500;
    ctx.body = { error: "Failed to delete movie" };
  }
  await next();
};
// router.get("/", (ctx) => {
//   ctx.body = { id: 1, title: "Test Movie", year: 2026 };
// });
// 路由掛載
router.get("/", getAllMovies);
router.get("/:id", getMovieById);
router.post("/", authMiddleware, bodyParser(), createMovie);
router.put("/:id", authMiddleware, bodyParser(), updateMovie);
router.delete("/:id", authMiddleware, deleteMovie);

export { router };
