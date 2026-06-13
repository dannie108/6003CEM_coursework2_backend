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
// src/routes/movies.ts
const koa_router_1 = __importDefault(require("koa-router"));
const koa_bodyparser_1 = __importDefault(require("koa-bodyparser"));
const model = __importStar(require("../models/movies"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = new koa_router_1.default({ prefix: "/api/v1/movies" });
exports.router = router;
// 取得所有電影
const getAllMovies = async (ctx, next) => {
    const movies = await model.getAll();
    ctx.body = movies.length ? movies : [];
    await next();
};
// 取得單一電影
const getMovieById = async (ctx, next) => {
    const id = Number(ctx.params.id);
    const movie = await model.getById(id);
    if (!movie.length) {
        ctx.status = 404;
        ctx.body = { error: "Movie not found" };
    }
    else {
        ctx.body = movie[0];
    }
    await next();
};
// 新增電影
const createMovie = async (ctx, next) => {
    const body = ctx.request.body;
    const result = await model.add(body);
    if (result.status === 201) {
        ctx.status = 201;
        ctx.body = body;
    }
    else {
        ctx.status = 500;
        ctx.body = { error: "Failed to add movie" };
    }
    await next();
};
// 更新電影
const updateMovie = async (ctx, next) => {
    const id = Number(ctx.params.id);
    const body = ctx.request.body;
    const result = await model.update(id, body);
    if (result.status === 201) {
        ctx.status = 201;
        ctx.body = body;
    }
    else {
        ctx.status = 500;
        ctx.body = { error: "Failed to update movie" };
    }
    await next();
};
// 刪除電影
const deleteMovie = async (ctx, next) => {
    const id = Number(ctx.params.id);
    const result = await model.del(id);
    if (result.status === 201) {
        ctx.status = 201;
        ctx.body = { message: `Removed movie ${id}` };
    }
    else {
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
router.post("/", authMiddleware_1.authMiddleware, (0, koa_bodyparser_1.default)(), createMovie);
router.put("/:id", authMiddleware_1.authMiddleware, (0, koa_bodyparser_1.default)(), updateMovie);
router.delete("/:id", authMiddleware_1.authMiddleware, deleteMovie);
//# sourceMappingURL=movies.js.map