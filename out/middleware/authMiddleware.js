"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";
const authMiddleware = async (ctx, next) => {
    const authHeader = ctx.headers["authorization"];
    if (!authHeader) {
        ctx.status = 401;
        ctx.body = { message: "Missing token" };
        return;
    }
    const token = authHeader.split(" ")[1] ?? "";
    if (!token) {
        ctx.status = 401;
        ctx.body = { message: "Token not provided" };
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, SECRET_KEY);
        if (typeof decoded === "string") {
            ctx.status = 403;
            ctx.body = { message: "Invalid token" };
            return;
        }
        const { id, username, role } = decoded;
        if (!id || !username) {
            ctx.status = 403;
            ctx.body = { message: "Invalid token payload" };
            return;
        }
        const numericId = Number(id);
        if (Number.isNaN(numericId)) {
            ctx.status = 403;
            ctx.body = { message: "Invalid user ID in token" };
            return;
        }
        ctx.state.user = {
            id: numericId,
            username,
            role,
        };
        console.log("Decoded token payload:", decoded);
        console.log("ctx.state.user:", ctx.state.user);
        await next();
    }
    catch (err) {
        console.error("JWT verify error:", err);
        ctx.status = 403;
        ctx.body = { message: "Invalid token" };
    }
};
exports.authMiddleware = authMiddleware;
//# sourceMappingURL=authMiddleware.js.map