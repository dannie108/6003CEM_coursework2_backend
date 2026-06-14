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
// src/routes/users.ts
const koa_router_1 = __importDefault(require("koa-router"));
const koa_bodyparser_1 = __importDefault(require("koa-bodyparser"));
const model = __importStar(require("../models/users"));
const db = __importStar(require("../helpers/database"));
const auth_1 = require("../controllers/auth");
const authMiddleware_1 = require("../middleware/authMiddleware");
const validation_1 = require("../middleware/validation");
const router = new koa_router_1.default({ prefix: "/api/v1/users" });
exports.router = router;
// -------------------- User Info --------------------
const getMe = async (ctx) => {
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
        }
        else {
            ctx.status = 404;
            ctx.body = { err: "User not found" };
        }
    }
    catch (err) {
        console.error("Get me error:", err);
        ctx.status = 500;
        ctx.body = { err: "Database error" };
    }
};
const getAll = async (ctx) => {
    const users = await model.getAll();
    ctx.body = users.length ? users : {};
};
const getById = async (ctx) => {
    let id = Number(ctx.params.id);
    // 如果路由參數不是有效數字，就 fallback 用 token 的 id 或 query
    if (!id || isNaN(id)) {
        id = Number(ctx.state.user?.id || ctx.query.userId);
    }
    const users = await model.getById(id);
    if (!Number.isInteger(id) || id <= 0 || !users.length) {
        ctx.status = 400;
        ctx.body = "Invalid ID";
    }
    else {
        ctx.body = users[0];
    }
};
const updateUser = async (ctx) => {
    let id = Number(ctx.params.id);
    if (!id || isNaN(id)) {
        id = Number(ctx.state.user?.id || ctx.request.body.userId);
    }
    const body = ctx.request.body;
    const result = await model.update(id, body);
    if (result.status == 201) {
        ctx.status = 201;
        ctx.body = body;
    }
    else {
        ctx.status = 500;
        ctx.body = { err: "update data failed" };
    }
};
const deleteUser = async (ctx) => {
    let id = Number(ctx.params.id);
    if (!id || isNaN(id)) {
        id = Number(ctx.state.user?.id || ctx.request.body.userId);
    }
    const result = await model.del(id);
    if (result.status == 201) {
        ctx.status = 201;
        ctx.body = { message: "Removed user " + id };
    }
    else {
        ctx.status = 500;
        ctx.body = { err: "delete data failed" };
    }
};
// -------------------- Watchlist / Watched --------------------
const addToWatchlist = async (ctx) => {
    const { movieId, userId: bodyUserId } = ctx.request.body;
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
        await db.run_insert("INSERT INTO user_movie_status (user_id, movie_id, status) VALUES (?, ?, ?)", [userId, movieId, "watchlist"]);
        ctx.body = { success: true };
    }
    catch (err) {
        ctx.status = 400;
        ctx.body = { error: "Already in watchlist or DB error" };
    }
};
const getWatchlist = async (ctx) => {
    let userId = Number(ctx.state.user?.id);
    if (!userId || isNaN(userId)) {
        userId = Number(ctx.query.userId);
    }
    if (!userId || isNaN(userId)) {
        ctx.status = 400;
        ctx.body = { error: "Invalid user id" };
        return;
    }
    const movies = await db.run_query(`SELECT m.* 
     FROM user_movie_status ums 
     JOIN movies m ON ums.movie_id = m.id 
     WHERE ums.user_id = ? AND ums.status = ?`, [userId, "watchlist"]);
    ctx.body = movies;
};
const addToWatched = async (ctx) => {
    const { movieId, userId: bodyUserId } = ctx.request.body;
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
        await db.run_insert("INSERT INTO user_movie_status (user_id, movie_id, status) VALUES (?, ?, ?)", [userId, movieId, "watched"]);
        ctx.body = { success: true };
    }
    catch (err) {
        ctx.status = 400;
        ctx.body = { error: "Already marked watched or DB error" };
    }
};
const getWatched = async (ctx) => {
    let userId = Number(ctx.state.user?.id);
    if (!userId || isNaN(userId)) {
        userId = Number(ctx.query.userId);
    }
    if (!userId || isNaN(userId)) {
        ctx.status = 400;
        ctx.body = { error: "Invalid user id" };
        return;
    }
    const movies = await db.run_query(`SELECT m.* 
     FROM user_movie_status ums 
     JOIN movies m ON ums.movie_id = m.id 
     WHERE ums.user_id = ? AND ums.status = ?`, [userId, "watched"]);
    ctx.body = movies;
};
// -------------------- Routes --------------------
router.post("/register", (0, koa_bodyparser_1.default)(), auth_1.register);
router.post("/login", (0, koa_bodyparser_1.default)(), auth_1.login);
router.get("/me", authMiddleware_1.authMiddleware, getMe);
router.get("/", authMiddleware_1.authMiddleware, getAll);
router.get("/:id", authMiddleware_1.authMiddleware, getById);
router.put("/:id", authMiddleware_1.authMiddleware, (0, koa_bodyparser_1.default)(), validation_1.validateUser, updateUser);
router.delete("/:id", authMiddleware_1.authMiddleware, deleteUser);
router.get("/watchlist", authMiddleware_1.authMiddleware, getWatchlist);
router.get("/watched", authMiddleware_1.authMiddleware, getWatched);
router.post("/watched", authMiddleware_1.authMiddleware, (0, koa_bodyparser_1.default)(), addToWatched);
router.post("/watchlist", authMiddleware_1.authMiddleware, (0, koa_bodyparser_1.default)(), addToWatchlist);
//# sourceMappingURL=users.js.map