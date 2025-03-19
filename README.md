# Project: TypeScript Node.js Server with MongoDB

## Overview
This project is a simple backend server built with TypeScript and Node.js. It connects to a MongoDB database and provides APIs to manage users, posts, and comments. The data is fetched from JSONPlaceholder and stored in MongoDB.

## Features
- Fetch users, posts, and comments from JSONPlaceholder (`GET /load`)
- Retrieve a specific user (`GET /users/:userId`)
- Delete all users (`DELETE /users`)
- Delete a specific user (`DELETE /users/:userId`)
- Insert a new user (`PUT /users`)

## Project Structure
```
📁 Node_Assignment
 ├── db.ts          # MongoDB database connection
 ├── server.ts      # HTTP server handling requests
 ├── types.ts       # TypeScript type definitions
```

## Installation & Setup
### 1. Install Dependencies
Make sure you have **Node.js** installed, then run:
```
npm install
```

### 2. Start MongoDB
Ensure MongoDB is running locally at `mongodb://localhost:27017`.

### 3. Run the Server
```
npx ts-node src/server.ts // npm start
```

## API Endpoints
### 1. Load Data from JSONPlaceholder
**GET /load**
- Fetches 10 users and their posts/comments from JSONPlaceholder and saves them to MongoDB.

### 2. Get a User by ID
**GET /users/:userId**
- Retrieves a user with their posts and comments.

### 3. Delete All Users
**DELETE /users**
- Deletes all users from the database.

### 4. Delete a User by ID
**DELETE /users/:userId**
- Deletes a specific user from the database.

### 5. Insert a New User
**PUT /users**
- Adds a new user to the database (if they don’t already exist).

## Technologies Used
- TypeScript
- Node.js (without Express)
- MongoDB
- JSONPlaceholder API

## Troubleshooting
- If MongoDB is not running, start it with:
  ```
  mongod
  ```
- If `ts-node` is not installed globally, run:
  ```
  npm install -g ts-node
  ```

## Error Handling

- 400: Invalid request body
- 404: Resource not found
- 409: Resource already exists
- 500: Internal server error
