import Router, { RouterContext } from "koa-router";
import bodyParser from "koa-bodyparser";
import * as model from "../models/movies";
import { authMiddleware } from "../middleware/authMiddleware";
import { run_insert, run_update, run_query } from "../helpers/database";

const router = new Router({ prefix: "/api/v1/movies" });

// 取得所有電影
const getAllMovies = async (ctx: RouterContext) => {
  const movies = await model.getAll();
  ctx.body = movies.length ? movies : [];
};

// 依 ID 取得電影
const getMovieById = async (ctx: RouterContext) => {
  const id = Number(ctx.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    ctx.status = 400;
    ctx.body = { error: "Invalid movie ID" };
    return;
  }

  try {
    const movie = await model.getById(id);
    ctx.status = movie.length ? 200 : 404;
    ctx.body = movie.length ? movie[0] : { error: "Movie not found" };
  } catch (err) {
    console.error("DB error getMovieById:", err);
    ctx.status = 500;
    ctx.body = { error: "Database query error" };
  }
};


// 新增電影
const createMovie = async (ctx: RouterContext) => {
  const body = ctx.request.body;
  const result = await model.add(body);
  ctx.status = result.status;
  ctx.body = result.status === 201 ? body : { error: "Failed to add movie" };
};

// 更新電影
const updateMovie = async (ctx: RouterContext) => {
  const id = Number(ctx.params.id);
  const body = ctx.request.body;
  const result = await model.update(id, body);
  ctx.status = result.status;
  ctx.body = result.status === 201 ? body : { error: "Failed to update movie" };
};

// 刪除電影
const deleteMovie = async (ctx: RouterContext) => {
  const id = Number(ctx.params.id);
  const result = await model.del(id);
  ctx.status = result.status;
  ctx.body = result.status === 201 ? { message: `Removed movie ${id}` } : { error: "Failed to delete movie" };
};

// 推薦電影
const recommendMovie = async (ctx: RouterContext) => {
  const movieId = Number(ctx.params.id);
  const userId = ctx.state.user.id;
  try {
    await run_insert("INSERT INTO user_recommend (user_id, movie_id) VALUES (?, ?)", [userId, movieId]);
    await run_update("UPDATE movies SET recommend_count = recommend_count + 1 WHERE id = ?", [movieId]);
    ctx.body = { success: true };
  } catch {
    ctx.status = 400;
    ctx.body = { error: "Already recommended or DB error" };
  }
};

// 取得推薦排行榜
const getRecommendedMovies = async (ctx: RouterContext) => {
  try {
  const movies = await run_query("SELECT * FROM movies ORDER BY recommend_count DESC", []);
  ctx.body = movies;
  }catch (err) {
    ctx.status = 500;
    ctx.body = { error: "Failed to fetch recommended movies" };
  }
};

// 路由掛載
router.get("/", getAllMovies);
router.get("/recommend", authMiddleware, getRecommendedMovies);
router.get("/:id", getMovieById);
router.post("/", authMiddleware, bodyParser(), createMovie);
router.put("/:id", authMiddleware, bodyParser(), updateMovie);
router.delete("/:id", authMiddleware, deleteMovie);
router.post("/:id/recommend", authMiddleware, recommendMovie);


export { router };
