// src/models/movies.ts
import * as db from "../helpers/database";

// 取得所有電影
export const getAll = async () => {
  const query = "SELECT * FROM movies;";
  try {
    const result = await db.run_query(query, []);
    return result.rows;
  } catch (err) {
    console.error("getAll movies DB error:", err);
    return [];
  }
};

// 依 ID 取得電影
export const getById = async (id: number) => {
  try {
    const result = await db.run_query("SELECT * FROM movies WHERE id = ?;", [id]);
    return result.rows;
  } catch (err) {
    console.error("getById movies DB error:", err);
    return [];
  }
};

// 新增電影
export const add = async (movie: any) => {
  const keys = Object.keys(movie);
  const values = Object.values(movie);
  const key = keys.join(",");
  const param = keys.map(() => "?").join(",");
  const query = `INSERT INTO movies (${key}) VALUES (${param});`;

  try {
    const result = await db.run_insert(query, values);
    return { status: 201, id: result.insertId, affectedRows: result.affectedRows };
  } catch (err: any) {
    console.error("add movies DB error:", err);
    return { status: 500, error: err.message };
  }
};

// 更新電影
export const update = async (id: number, movie: any) => {
  let query = "UPDATE movies SET ";
  const values: any = { id };
  const setClauses: string[] = [];

  Object.keys(movie).forEach((key) => {
    setClauses.push(`${key} = :${key}`);
    values[key] = movie[key];
  });

  query += setClauses.join(", ") + " WHERE id = :id;";

  try {
    const result = await db.run_update(query, values);
    return { status: 200, affectedRows: result.affectedRows };
  } catch (err: any) {
    console.error("update movies DB error:", err);
    return { status: 500, error: err.message };
  }
};

// 刪除電影
export const del = async (id: number) => {
  const query = "DELETE FROM movies WHERE id = :id;";
  const values = { id };

  try {
    const result = await db.run_delete(query, values);
    return { status: 200, affectedRows: result.affectedRows };
  } catch (err: any) {
    console.error("del movies DB error:", err);
    return { status: 500, error: err.message };
  }
};
