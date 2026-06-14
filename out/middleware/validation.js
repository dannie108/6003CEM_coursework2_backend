"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUser = void 0;
const jsonschema_1 = require("jsonschema");
const user_schema_1 = require("../schemas/user.schema");
const v = new jsonschema_1.Validator();
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