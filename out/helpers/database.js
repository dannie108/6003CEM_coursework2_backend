"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.run_delete = exports.run_update = exports.run_insert = exports.run_query = void 0;
// helpers/database.ts
const sequelize_1 = require("sequelize");
const config_1 = __importDefault(require("../config"));
const createSequelize = () => {
    return new sequelize_1.Sequelize(config_1.default.database, config_1.default.user, config_1.default.password, {
        host: config_1.default.host,
        port: config_1.default.port,
        dialect: 'mysql',
        logging: false, // 若要看 SQL 與連線資訊，改成 console.log
        pool: {
            max: 10,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    });
};
const run_query = async (query, values) => {
    const sequelize = createSequelize();
    try {
        await sequelize.authenticate();
        const data = await sequelize.query(query, {
            replacements: values,
            type: sequelize_1.QueryTypes.SELECT
        });
        await sequelize.close();
        return data;
    }
    catch (err) {
        console.error('DB error SELECT', err, query, values);
        await sequelize.close();
        throw 'Database query error';
    }
};
exports.run_query = run_query;
const run_insert = async (sql, values) => {
    const sequelize = createSequelize();
    try {
        await sequelize.authenticate();
        const data = await sequelize.query(sql, {
            replacements: values,
            type: sequelize_1.QueryTypes.INSERT
        });
        await sequelize.close();
        return data;
    }
    catch (err) {
        console.error('DB error INSERT', err, sql, values);
        await sequelize.close();
        throw 'Database query error';
    }
};
exports.run_insert = run_insert;
const run_update = async (sql, values) => {
    const sequelize = createSequelize();
    try {
        await sequelize.authenticate();
        const data = await sequelize.query(sql, {
            replacements: values,
            type: sequelize_1.QueryTypes.UPDATE
        });
        await sequelize.close();
        return data;
    }
    catch (err) {
        console.error('DB error UPDATE', err, sql, values);
        await sequelize.close();
        throw 'Database query error';
    }
};
exports.run_update = run_update;
const run_delete = async (sql, values) => {
    const sequelize = createSequelize();
    try {
        await sequelize.authenticate();
        const data = await sequelize.query(sql, {
            replacements: values,
            type: sequelize_1.QueryTypes.DELETE
        });
        await sequelize.close();
        return data;
    }
    catch (err) {
        console.error('DB error DELETE', err, sql, values);
        await sequelize.close();
        throw 'Database query error';
    }
};
exports.run_delete = run_delete;
//# sourceMappingURL=database.js.map