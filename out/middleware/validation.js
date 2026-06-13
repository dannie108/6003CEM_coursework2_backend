"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUser = exports.validateArticle = void 0;
//middleware/validation.ts
const jsonschema_1 = require("jsonschema");
const article_schema_1 = require("../schemas/article.schema");
const user_schema_1 = require("../schemas/user.schema");
const v = new jsonschema_1.Validator();
const validateArticle = async (ctx, next) => {
    const validationOptions = {
        throwError: true,
        allowUnknownAttributes: false
    };
    const body = ctx.request.body;
    try {
        v.validate(body, article_schema_1.article, validationOptions);
        await next();
    }
    catch (error) {
        if (error instanceof jsonschema_1.ValidationError) {
            ctx.body = error;
            ctx.status = 400;
        }
        else {
            throw error;
        }
    }
};
exports.validateArticle = validateArticle;
const validateUser = async (ctx, next) => {
    const validationOptions = {
        throwError: true,
        allowUnknownAttributes: false
    };
    const body = ctx.request.body;
    try {
        v.validate(body, user_schema_1.user, validationOptions);
        await next();
    }
    catch (error) {
        if (error instanceof jsonschema_1.ValidationError) {
            ctx.body = error;
            ctx.status = 400;
        }
        else {
            throw error;
        }
    }
};
exports.validateUser = validateUser;
//# sourceMappingURL=validation.js.map