// src/models/users.ts
import * as db from '../helpers/database';

export const getAll = async () => {
  const query = "SELECT * FROM users";
  try {
    const result = await db.run_query(query, []);
    return result.rows;
  } catch (err) {
    console.error("getAll DB error:", err);
    return [];
  }
};

export const getById = async (id: number | string) => {
  const userId = Number(id);

  if (Number.isNaN(userId) || userId <= 0) {
    console.error("Invalid id passed to getById:", id, "(type:", typeof id, ")");
    return [];
  }

  try {
    const result = await db.run_query("SELECT * FROM users WHERE id = ?", [userId]);
    return result.rows;
  } catch (err) {
    console.error("getById DB error:", err);
    return [];
  }
};

export const add = async (user: any) => {
  const keys = Object.keys(user);
  const values = Object.values(user);
  const key = keys.join(',');
  const param = Array(values.length).fill('?').join(',');
  const query = `INSERT INTO users (${key}) VALUES (${param})`;

  try {
    const result = await db.run_insert(query, values);
    return { status: 201, id: result.insertId, affectedRows: result.affectedRows };
  } catch (err: any) {
    console.error("add DB error:", err);
    return { status: 500, error: err.message };
  }
};

export const update = async (id: number, user: any) => {
  let query = "UPDATE users SET ";
  const values: any = { id };
  const setClauses: string[] = [];

  Object.keys(user).forEach((key) => {
    setClauses.push(`${key} = :${key}`);
    values[key] = user[key];
  });

  query += setClauses.join(', ') + " WHERE id = :id;";

  try {
    const result = await db.run_update(query, values);
    return { status: 200, affectedRows: result.affectedRows };
  } catch (err: any) {
    console.error("update DB error:", err);
    return { status: 500, error: err.message };
  }
};

export const del = async (id: number) => {
  const query = `DELETE FROM users WHERE id = :id;`;
  const values = { id };

  try {
    const result = await db.run_delete(query, values);
    return { status: 200, affectedRows: result.affectedRows };
  } catch (err: any) {
    console.error("del DB error:", err);
    return { status: 500, error: err.message };
  }
};

export const findByUsername = async (username: string) => {
  const query = 'SELECT * FROM users WHERE username = ?';
  try {
    const result = await db.run_query(query, [username]);
    return result.rows;
  } catch (err) {
    console.error("findByUsername DB error:", err);
    return [];
  }
};
