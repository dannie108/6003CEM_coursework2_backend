"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const koa_router_1 = __importDefault(require("koa-router"));
const koa_bodyparser_1 = __importDefault(require("koa-bodyparser"));
const model = __importStar(require("../models/movies"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const database_1 = require("../helpers/database");
const router = new koa_router_1.default({ prefix: "/api/v1/movies" });
exports.router = router;
// 取得所有電影
const getAllMovies = async (ctx) => {
    const movies = await model.getAll();
    ctx.body = movies.length ? movies : [];
};
// 依 ID 取得電影
const getMovieById = async (ctx) => {
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
    }
    catch (err) {
        console.error("DB error getMovieById:", err);
        ctx.status = 500;
        ctx.body = { error: "Database query error" };
    }
};
// 新增電影
const createMovie = async (ctx) => {
    const body = ctx.request.body;
    const result = await model.add(body);
    ctx.status = result.status;
    ctx.body = result.status === 201 ? body : { error: "Failed to add movie" };
};
// 更新電影
const updateMovie = async (ctx) => {
    const id = Number(ctx.params.id);
    const body = ctx.request.body;
    const result = await model.update(id, body);
    ctx.status = result.status;
    ctx.body = result.status === 201 ? body : { error: "Failed to update movie" };
};
// 刪除電影
const deleteMovie = async (ctx) => {
    const id = Number(ctx.params.id);
    const result = await model.del(id);
    ctx.status = result.status;
    ctx.body = result.status === 201 ? { message: `Removed movie ${id}` } : { error: "Failed to delete movie" };
};
// 推薦電影
const recommendMovie = async (ctx) => {
    const movieId = Number(ctx.params.id);
    const userId = ctx.state.user.id;
    try {
        await (0, database_1.run_insert)("INSERT INTO user_recommend (user_id, movie_id) VALUES (?, ?)", [userId, movieId]);
        await (0, database_1.run_update)("UPDATE movies SET recommend_count = recommend_count + 1 WHERE id = ?", [movieId]);
        ctx.body = { success: true };
    }
    catch {
        ctx.status = 400;
        ctx.body = { error: "Already recommended or DB error" };
    }
};
// 取得推薦排行榜
const getRecommendedMovies = async (ctx) => {
    try {
        const movies = await (0, database_1.run_query)("SELECT * FROM movies ORDER BY recommend_count DESC", []);
        ctx.body = movies;
    }
    catch (err) {
        ctx.status = 500;
        ctx.body = { error: "Failed to fetch recommended movies" };
    }
};
// 路由掛載
router.get("/", getAllMovies);
router.get("/recommend", authMiddleware_1.authMiddleware, getRecommendedMovies);
router.get("/:id", getMovieById);
router.post("/", authMiddleware_1.authMiddleware, (0, koa_bodyparser_1.default)(), createMovie);
router.put("/:id", authMiddleware_1.authMiddleware, (0, koa_bodyparser_1.default)(), updateMovie);
router.delete("/:id", authMiddleware_1.authMiddleware, deleteMovie);
router.post("/:id/recommend", authMiddleware_1.authMiddleware, recommendMovie);
//# sourceMappingURL=movies.js.map