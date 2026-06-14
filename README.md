 6003CEM Coursework 2 – CinemaVault Backend API

## Overview

This project is a backend API for a modern **film catalogue and recommendation system** called **CinemaVault**.  
It provides user authentication and movie management.

### Features
- User registration and JWT-based authentication
- Role-based access (User / Admin)
-  CRUD operations for Movies
- MySQL database integration

## Tech Stack
- **Framework**: Koa.js
- **Language**: TypeScript
- **Database**: MySQL
- **Authentication**: JWT
- **Documentation**: OpenAPI 3.0 + Redoc

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/dannie108/6003CEM_coursework2_backend.git
   cd 6003CE_Coursework2_backend

2. Install dependencies
    ```bash
    npm install

3. Database Setup
* Ensure MySQL is running
* Run the SQL scripts `cinemavaultdb.sql` in the `database/` folder
* Set up connection with database

For database setup, you can refer to config.ts and make changes
```
  // src/config.ts
  const config = {
    host: "localhost",
    port: 3306,   
    user: "root",    
    password: "root",   
    database: "cinemavault",
    connection_limit:100
}
```


4. Compile files
    ```bash
    npx tsc


5. Start the server
    ```bash
    npm run start

Or simply run provided `install.bat` and `run.bat` in folder

Server will run at: http://localhost:10888

`out/` folder should be removed before recomplie if need

## API Documentation
Interactive Documentation (Redoc)

→ http://localhost:10888/CinemaVaultApi.html

OpenAPI Specification

→ `docs/yaml/openapi.yaml`

## API Routes
### Base URL
All routes are prefixed with `/api/v1`

Due to outcomes of the assignment, some APIs are not used in front end.
## User
| Endpoint | Method | Description |
|------|------|------|
| /users/register | POST | Register new user |
| /users/login    | POST | Login & get JWT|
| /users/me       | GET  | Get current user profile  (not been used)|
| /users          | GET  | Get all users (Admin only) (not been used)|
| /users/{id}     | GET  | Get user by ID  (not been used)|
| /users/{id}     | PUT  | Update user (not been used) |
| /users/{id}     | DELETE | Delete user  (not been used)|

### Movies Routes


### Movies Routes

| Endpoint          | Method   | Description                       |
|---------------|--------|----------------------------|
| /movies       | GET    | Get all movies               |
| /movies       | POST   | Add movie                   |
| /movies/{id}  | GET    | Get movie by ID            |
| /movies/{id}  | PUT    | Update movie                   |
| /movies/{id}  | DELETE | Delete movie                   |
| /movies/recommend | GET    | Get recommend movies                   |
| /movies/{id}/recommend  | POST | Recommend movies                 |




## Security

* JWT Authentication is required for protected routes
* Passwords are hashed using bcrypt

## Project Structure
```
|   .DS_Store
|   .env
|   .gitattributes
|   .gitignore
|   eslint.config.mjs
|   install.bat
|   jest.config.js
|   package-lock.json
|   package.json
|   README.md
|   run.bat
|   tsconfig.json
|   
+---database
|       cinemavaultdb.sql
|       
+---src
|   |   app.ts
|   |   config.ts
|   |   index.ts
|   |   
|   +---controllers
|   |       auth.ts
|   |       
|   +---docs
|   |   |   CinemaVaultApi.html
|   |   |   
|   |   \---yaml
|   |           movie.json
|   |           openapi.yaml
|   |           user.json
|   |           
|   +---helpers
|   |       database.ts
|   |       
|   +---middleware
|   |       authMiddleware.ts
|   |       validation.ts
|   |       
|   +---models
|   |       movies.ts
|   |       users.ts
|   |       
|   +---routes
|   |       movies.ts
|   |       users.ts
|   |       
|   \---schemas
|           movie.schema.ts
|           user.schema.ts
|           
\---test
    \---routes
            app.test.ts
            movies.test.ts
            user.test.ts
```
# License

Apache 2.0
