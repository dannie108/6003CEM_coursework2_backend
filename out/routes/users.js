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
// routes/users.ts
// 使用者相關路由：註冊、登入、CRUD
const koa_router_1 = __importDefault(require("koa-router"));
const koa_bodyparser_1 = __importDefault(require("koa-bodyparser"));
const model = __importStar(require("../models/users"));
const auth_1 = require("../controllers/auth"); // 新增 register/login controller
const authMiddleware_1 = require("../middleware/authMiddleware"); // JWT 驗證
const validation_1 = require("../middleware/validation"); // 驗證使用者資料
const router = new koa_router_1.default({ prefix: "/api/v1/users" });
exports.router = router;
// 取得目前登入使用者資訊
const getMe = async (ctx, next) => {
    const username = ctx.state.user?.username;
    if (!username) {
        ctx.status = 400;
        ctx.body = { err: "No username in state" };
        return;
    }
    const user = await model.findByUsername(username);
    if (user.length) {
        ctx.body = user[0];
    }
    else {
        ctx.body = {};
    }
    await next();
};
// 取得所有使用者
const getAll = async (ctx, next) => {
    const users = await model.getAll();
    ctx.body = users.length ? users : {};
    await next();
};
// 依 ID 取得使用者
const getById = async (ctx, next) => {
    const id = Number(ctx.params.id);
    const users = await model.getById(id);
    if (!Number.isInteger(id) || id <= 0 || !users.length) {
        ctx.status = 400;
        ctx.body = "Invalid ID";
    }
    else {
        ctx.body = users[0];
    }
    await next();
};
// 更新使用者 (需 JWT + validateUser)
router.put("/:id", authMiddleware_1.authMiddleware, (0, koa_bodyparser_1.default)(), validation_1.validateUser, async (ctx, next) => {
    const id = Number(ctx.params.id);
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
    await next();
});
// 刪除使用者 (需 JWT)
router.delete("/:id", authMiddleware_1.authMiddleware, async (ctx, next) => {
    const id = Number(ctx.params.id);
    const result = await model.del(id);
    if (result.status == 201) {
        ctx.status = 201;
        ctx.body = { message: "Removed user " + id };
    }
    else {
        ctx.status = 500;
        ctx.body = { err: "delete data failed" };
    }
    await next();
});
// 新增使用者 (註冊流程用 register controller)
router.post("/register", (0, koa_bodyparser_1.default)(), auth_1.register);
// 登入使用者 (login controller)
router.post("/login", (0, koa_bodyparser_1.default)(), auth_1.login);
// 取得目前登入使用者
router.get("/me", authMiddleware_1.authMiddleware, getMe);
// 取得所有使用者 (需 JWT)
router.get("/", authMiddleware_1.authMiddleware, getAll);
// 依 ID 取得使用者 (需 JWT)
router.get("/:id", authMiddleware_1.authMiddleware, getById);
//# sourceMappingURL=users.js.map