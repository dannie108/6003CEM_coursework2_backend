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
exports.del = exports.update = exports.add = exports.getById = exports.getAll = void 0;
// src/models/movies.ts
const db = __importStar(require("../helpers/database"));
// 取得所有電影
const getAll = async () => {
    const query = "SELECT * FROM movies;";
    try {
        const result = await db.run_query(query, []);
        return result.rows;
    }
    catch (err) {
        console.error("getAll movies DB error:", err);
        return [];
    }
};
exports.getAll = getAll;
// 依 ID 取得電影
const getById = async (id) => {
    try {
        const result = await db.run_query("SELECT * FROM movies WHERE id = ?;", [id]);
        return result.rows;
    }
    catch (err) {
        console.error("getById movies DB error:", err);
        return [];
    }
};
exports.getById = getById;
// 新增電影
const add = async (movie) => {
    const keys = Object.keys(movie);
    const values = Object.values(movie);
    const key = keys.join(",");
    const param = keys.map(() => "?").join(",");
    const query = `INSERT INTO movies (${key}) VALUES (${param});`;
    try {
        const result = await db.run_insert(query, values);
        return { status: 201, id: result.insertId, affectedRows: result.affectedRows };
    }
    catch (err) {
        console.error("add movies DB error:", err);
        return { status: 500, error: err.message };
    }
};
exports.add = add;
// 更新電影
const update = async (id, movie) => {
    let query = "UPDATE movies SET ";
    const values = { id };
    const setClauses = [];
    Object.keys(movie).forEach((key) => {
        setClauses.push(`${key} = :${key}`);
        values[key] = movie[key];
    });
    query += setClauses.join(", ") + " WHERE id = :id;";
    try {
        const result = await db.run_update(query, values);
        return { status: 200, affectedRows: result.affectedRows };
    }
    catch (err) {
        console.error("update movies DB error:", err);
        return { status: 500, error: err.message };
    }
};
exports.update = update;
// 刪除電影
const del = async (id) => {
    const query = "DELETE FROM movies WHERE id = :id;";
    const values = { id };
    try {
        const result = await db.run_delete(query, values);
        return { status: 200, affectedRows: result.affectedRows };
    }
    catch (err) {
        console.error("del movies DB error:", err);
        return { status: 500, error: err.message };
    }
};
exports.del = del;
//# sourceMappingURL=movies.js.map