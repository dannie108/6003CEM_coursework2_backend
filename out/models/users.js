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
Object.defineProperty(exports, "__esModule", { value: true });
exports.findByUsername = exports.del = exports.update = exports.add = exports.getById = exports.getAll = void 0;
// src/models/users.ts
const db = __importStar(require("../helpers/database"));
const getAll = async () => {
    const query = "SELECT * FROM users";
    try {
        const result = await db.run_query(query, []);
        return result.rows;
    }
    catch (err) {
        console.error("getAll DB error:", err);
        return [];
    }
};
exports.getAll = getAll;
const getById = async (id) => {
    const userId = Number(id);
    if (Number.isNaN(userId) || userId <= 0) {
        console.error("Invalid id passed to getById:", id, "(type:", typeof id, ")");
        return [];
    }
    try {
        const result = await db.run_query("SELECT * FROM users WHERE id = ?", [userId]);
        return result.rows;
    }
    catch (err) {
        console.error("getById DB error:", err);
        return [];
    }
};
exports.getById = getById;
const add = async (user) => {
    const keys = Object.keys(user);
    const values = Object.values(user);
    const key = keys.join(',');
    const param = Array(values.length).fill('?').join(',');
    const query = `INSERT INTO users (${key}) VALUES (${param})`;
    try {
        const result = await db.run_insert(query, values);
        return { status: 201, id: result.insertId, affectedRows: result.affectedRows };
    }
    catch (err) {
        console.error("add DB error:", err);
        return { status: 500, error: err.message };
    }
};
exports.add = add;
const update = async (id, user) => {
    let query = "UPDATE users SET ";
    const values = { id };
    const setClauses = [];
    Object.keys(user).forEach((key) => {
        setClauses.push(`${key} = :${key}`);
        values[key] = user[key];
    });
    query += setClauses.join(', ') + " WHERE id = :id;";
    try {
        const result = await db.run_update(query, values);
        return { status: 200, affectedRows: result.affectedRows };
    }
    catch (err) {
        console.error("update DB error:", err);
        return { status: 500, error: err.message };
    }
};
exports.update = update;
const del = async (id) => {
    const query = `DELETE FROM users WHERE id = :id;`;
    const values = { id };
    try {
        const result = await db.run_delete(query, values);
        return { status: 200, affectedRows: result.affectedRows };
    }
    catch (err) {
        console.error("del DB error:", err);
        return { status: 500, error: err.message };
    }
};
exports.del = del;
const findByUsername = async (username) => {
    const query = 'SELECT * FROM users WHERE username = ?';
    try {
        const result = await db.run_query(query, [username]);
        return result.rows;
    }
    catch (err) {
        console.error("findByUsername DB error:", err);
        return [];
    }
};
exports.findByUsername = findByUsername;
//# sourceMappingURL=users.js.map