
CREATE DATABASE IF NOT EXISTS cinemavault;
USE cinemavault;

-- user
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('user', 'admin') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- movie
CREATE TABLE IF NOT EXISTS movies (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  genre VARCHAR(100),
  year INT,
  rating DECIMAL(3,1),
  metascore INT,
  description TEXT,
  poster VARCHAR(255),
  recommend_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- wishlist & watched
CREATE TABLE IF NOT EXISTS user_movie_status (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  movie_id INT NOT NULL,
  status ENUM('watchlist','watched') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_user_movie (user_id, movie_id, status),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE
);

-- recommend
CREATE TABLE IF NOT EXISTS user_recommend (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  movie_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_user_recommend (user_id, movie_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE
);

-- test data
INSERT INTO movies (title, genre, year, rating) VALUES
('Inception', 'Sci-Fi', 2010, 8.8),
('The Dark Knight', 'Action', 2008, 9.0),
('Interstellar', 'Sci-Fi', 2014, 8.6),
('The Matrix', 'Sci-Fi', 1999, 8.7),
('Gladiator', 'Action', 2000, 8.5),
('Titanic', 'Romance', 1997, 7.9),
('Avengers: Endgame', 'Action', 2019, 8.4),
('Parasite', 'Thriller', 2019, 8.6),
('The Shawshank Redemption', 'Drama', 1994, 9.3),
('Forrest Gump', 'Drama', 1994, 8.8);
