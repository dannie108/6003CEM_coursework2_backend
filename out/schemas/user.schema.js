"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.user = void 0;
exports.user = {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "id": "/user",
    "title": "User",
    "description": "A user in the blog system",
    "type": "object",
    "properties": {
        "username": {
            "description": "Username of the user",
            "type": "string"
        },
        "email": {
            "description": "User's email",
            "type": "string"
        },
        "password": {
            "description": "User's password",
            "type": "string"
        },
        "passwordsalt": {
            "description": "User's salted/hashed password",
            "type": "string"
        },
        "firstname": {
            "description": "User's first name",
            "type": "string"
        },
        "lastname": {
            "description": "User's last name",
            "type": "string"
        },
        "avatarurl": {
            "description": "URL for user",
            "type": "uri"
        },
        "about": {
            "description": "User's introduction",
            "type": "string"
        },
    },
    "required": ["username", "email"]
};
//# sourceMappingURL=user.schema.js.map