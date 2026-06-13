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
    const data = await db.run_query(query, []);
    return data;
};
exports.getAll = getAll;
const getById = async (id) => {
    const query = "SELECT * FROM users WHERE id = ?";
    const values = [id];
    const data = await db.run_query(query, values);
    return data;
};
exports.getById = getById;
const add = async (user) => {
    const keys = Object.keys(user); // keys = ['username', 'email', 'password']
    const values = Object.values(user); // values = ['sam', 'sam@gmail.com', 'P@ssw0rd']
    const key = keys.join(',');
    let param = '';
    for (let i = 0; i < values.length; i++) {
        param += '?,';
    }
    ;
    param = param.slice(0, -1);
    const query = `INSERT INTO users (${key}) VALUES (${param})`;
    try {
        await db.run_insert(query, values);
        return { status: 201 };
    }
    catch (err) {
        return err;
    }
};
exports.add = add;
const update = async (id, user) => {
    let query = "UPDATE users SET ";
    const values = { id: id }; //{ id: 4, username: 'sam', email: 'sam@outlook.com'}
    const setClauses = [];
    Object.keys(user).forEach((key) => {
        setClauses.push(`${key} = :${key}`);
        values[key] = user[key];
    });
    query += setClauses.join(', ') + " WHERE id = :id;"; //UPDATE users SET username = :username, email = :email WHERE id = :id
    try {
        await db.run_update(query, values);
        return { status: 201 };
    }
    catch (err) {
        return err;
    }
};
exports.update = update;
const del = async (id) => {
    const query = `DELETE FROM users WHERE id = :id;`;
    const values = {
        id: id
    };
    try {
        await db.run_delete(query, values);
        return { status: 201 };
    }
    catch (err) {
        return err;
    }
};
exports.del = del;
// username, password, email, ...
const findByUsername = async (username) => {
    const query = 'SELECT * FROM users WHERE username = ?';
    const user = await db.run_query(query, [username]);
    return user;
};
exports.findByUsername = findByUsername;
//# sourceMappingURL=users.js.map