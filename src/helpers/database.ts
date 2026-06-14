// src/helpers/database.ts
import { Sequelize, QueryTypes } from "sequelize";
import config from '../config';

const createSequelize = () => {
  return new Sequelize(config.database, config.user, config.password, {
    host: config.host,
    port: config.port,
    dialect: 'mysql',
    logging: false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  });
};

export const run_query = async (query: string, values: any) => {
  const sequelize = createSequelize();
  try {
    await sequelize.authenticate();
    const data = await sequelize.query(query, {
      replacements: values,
      type: QueryTypes.SELECT
    });
    await sequelize.close();
    return { rows: data };
  } catch (err: any) {
    console.error('DB error SELECT', err, query, values);
    await sequelize.close();
    throw new Error('Database query error');
  }
};

export const run_insert = async (sql: string, values: any) => {
  const sequelize = createSequelize();
  try {
    await sequelize.authenticate();
    const result: any = await sequelize.query(sql, {
      replacements: values,
      type: QueryTypes.INSERT
    });
    await sequelize.close();
    // MySQL INSERT → [insertId, affectedRows]
    const insertId = Array.isArray(result) ? result[0] : null;
    const affectedRows = Array.isArray(result) ? result[1] : 0;
    return { insertId, affectedRows };
  } catch (err: any) {
    console.error('DB error INSERT', err, sql, values);
    await sequelize.close();
    throw new Error('Database query error');
  }
};

export const run_update = async (sql: string, values: any) => {
  const sequelize = createSequelize();
  try {
    await sequelize.authenticate();
    const result: any = await sequelize.query(sql, {
      replacements: values,
      type: QueryTypes.UPDATE
    });
    await sequelize.close();
    // UPDATE → [affectedRows]
    const affectedRows = Array.isArray(result) ? result[0] : 0;
    return { affectedRows };
  } catch (err: any) {
    console.error('DB error UPDATE', err, sql, values);
    await sequelize.close();
    throw new Error('Database query error');
  }
};

export const run_delete = async (sql: string, values: any) => {
  const sequelize = createSequelize();
  try {
    await sequelize.authenticate();
    const result: any = await sequelize.query(sql, {
      replacements: values,
      type: QueryTypes.DELETE
    });
    await sequelize.close();
    // DELETE → [affectedRows]
    const affectedRows = Array.isArray(result) ? result[0] : 0;
    return { affectedRows };
  } catch (err: any) {
    console.error('DB error DELETE', err, sql, values);
    await sequelize.close();
    throw new Error('Database query error');
  }
};
