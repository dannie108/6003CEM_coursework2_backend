"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_1 = __importDefault(require("koa"));
const koa_bodyparser_1 = __importDefault(require("koa-bodyparser"));
const cors_1 = __importDefault(require("@koa/cors"));
const users_1 = require("./routes/users");
const movies_1 = require("./routes/movies");
const koa_static_1 = __importDefault(require("koa-static"));
const koa_router_1 = __importDefault(require("koa-router"));
const app = new koa_1.default();
const router = new koa_router_1.default();
app.use((0, cors_1.default)());
app.use((0, koa_bodyparser_1.default)());
app.use(users_1.router.routes());
app.use(users_1.router.allowedMethods());
app.use(movies_1.router.routes());
app.use(movies_1.router.allowedMethods());
router.get("/", (ctx) => {
    ctx.body = {
        message: "Hello from localhost!",
        status: "ok",
        time: new Date().toISOString()
    };
});
app.use(router.routes()).use(router.allowedMethods());
app.use(async (ctx, next) => {
    try {
        await next();
        if (ctx.status === 404) {
            ctx.status = 404;
            ctx.body = { err: "No such endpoint existed" };
        }
    }
    catch (err) {
        ctx.status = err.status || 500;
        ctx.body = { err: err.message || "Internal server error" };
    }
});
app.use((0, koa_static_1.default)("./docs"));
exports.default = app;
//# sourceMappingURL=app.js.map