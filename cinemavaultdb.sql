-- 建立資料庫
CREATE DATABASE IF NOT EXISTS cinemavault;
USE cinemavault;

-- 建立使用者表
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 建立電影表
CREATE TABLE IF NOT EXISTS movies (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  genre VARCHAR(100),
  year INT,
  rating DECIMAL(3,1),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 測試用帳號 (密碼需用 bcrypt 產生)


-- 測試用電影
INSERT INTO movies (title, genre, year, rating) VALUES
('Inception', 'Sci-Fi', 2010, 8.8),
('The Dark Knight', 'Action', 2008, 9.0),
('Interstellar', 'Sci-Fi', 2014, 8.6);
