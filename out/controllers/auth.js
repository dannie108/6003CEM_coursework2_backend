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
exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const users = __importStar(require("../models/users"));
const SECRET_KEY = "your_secret_key"; // 建議放到 config.ts
// 註冊新使用者
const register = async (ctx, next) => {
    const { username, password } = ctx.request.body;
    const hashedPassword = await bcryptjs_1.default.hash(password, 10);
    try {
        await users.add({ username, password: hashedPassword });
        ctx.status = 201;
        ctx.body = { message: "Registration successful" };
    }
    catch (error) {
        ctx.status = 500;
        ctx.body = { message: "Error during registration" };
    }
    await next();
};
exports.register = register;
// 使用者登入
const login = async (ctx, next) => {
    const { username, password } = ctx.request.body;
    const result = await users.findByUsername(username);
    if (!result.length) {
        ctx.status = 401;
        ctx.body = { message: "User not found" };
        return;
    }
    const user = result[0];
    const isMatch = await bcryptjs_1.default.compare(password, user.password);
    if (!isMatch) {
        ctx.status = 401;
        ctx.body = { message: "Incorrect password" };
        return;
    }
    const token = jsonwebtoken_1.default.sign({ id: user.id, username: user.username }, SECRET_KEY, {
        expiresIn: "1h",
    });
    ctx.body = { token };
    await next();
};
exports.login = login;
//# sourceMappingURL=auth.js.map