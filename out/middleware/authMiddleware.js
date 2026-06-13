"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key"; // 建議放到環境變數
// 基本 JWT 驗證 middleware
const authMiddleware = async (ctx, next) => {
    const authHeader = ctx.headers["authorization"];
    if (!authHeader) {
        ctx.status = 401;
        ctx.body = { message: "Missing token" };
        return;
    }
    const token = authHeader.split(" ")[1];
    try {
        const decoded = jsonwebtoken_1.default.verify(token, SECRET_KEY);
        ctx.state.user = decoded; // 把解碼後的使用者資訊放到 ctx.state
        await next();
    }
    catch (err) {
        ctx.status = 403;
        ctx.body = { message: "Invalid token" };
    }
};
exports.authMiddleware = authMiddleware;
//# sourceMappingURL=authMiddleware.js.map