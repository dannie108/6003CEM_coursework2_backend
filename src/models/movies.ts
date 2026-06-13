// src/models/movies.ts
import * as db from "../helpers/database";

// 取得所有電影
export const getAll = async () => {
  const query = "SELECT * FROM movies;";
  return await db.run_query(query, []);
};

// 依 ID 取得電影
export const getById = async (id: number) => {
  const query = "SELECT * FROM movies WHERE id = ?;";
  return await db.run_query(query, [id]);
};

// 新增電影
export const add = async (movie: any) => {
  const keys = Object.keys(movie);
  const values = Object.values(movie);
  const key = keys.join(",");
  const param = keys.map(() => "?").join(",");
  const query = `INSERT INTO movies (${key}) VALUES (${param});`;

  try {
    await db.run_insert(query, values);
    return { status: 201 };   // 👈 包裝成物件
  } catch (err: any) {
    return { status: 500, error: err };
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
    await db.run_update(query, values);
    return { status: 201 };   // 👈 包裝成物件
  } catch (err: any) {
    return { status: 500, error: err };
  }
};

// 刪除電影
export const del = async (id: number) => {
  const query = "DELETE FROM movies WHERE id = :id;";
  const values = { id };

  try {
    await db.run_delete(query, values);
    return { status: 201 };   // 👈 包裝成物件
  } catch (err: any) {
    return { status: 500, error: err };
  }
};
