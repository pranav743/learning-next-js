# Books Management API

## Features
- User authentication (JWT)
- CRUD for books (per user)
- Redis caching for GET /books (per user)
- Bulk books insertion via Redis + cron job
- MongoDB (Mongoose)

## Setup

### 1. Install dependencies

```
yarn install
```

### 2. Configure environment

Copy `.env.example` to `.env` and set values as needed.

### 3. Start MongoDB

Ensure MongoDB is running locally or update `MONGO_URI` in `.env`.

### 4. (Optional) Start Redis

- If Redis is not running, caching and bulk jobs will be skipped gracefully.
- To run Redis locally:
  - On macOS: `brew install redis && brew services start redis`
  - Or use Docker: `docker run -p 6379:6379 redis`

### 5. Start the server

```
yarn dev
```

## API Endpoints

### Auth
- `POST /api/signup` { username, password }
- `POST /api/login` { username, password }

### Books (JWT required)
- `GET /api/books` — List all books (cached)
- `POST /api/books` — Add a book
- `PUT /api/books/:id` — Update a book
- `DELETE /api/books/:id` — Delete a book
- `POST /api/books/bulk` — Bulk add books (array)

## Bulk Books Insertion Flow
1. Send `POST /api/books/bulk` with `{ books: [ ... ] }` (array of book objects).
2. Books are stored in Redis under your user key.
3. Every 2 minutes, a background cron job reads all users' pending bulk books from Redis and inserts them into MongoDB.
4. After successful insertion, the Redis entry is deleted.

## Notes
- Redis keys are always scoped per user.
- If Redis is unavailable, caching and bulk jobs are skipped without crashing the app.
- Cron job runs in a non-blocking way.
- All validation and error handling is enforced.

## Testing Bulk Insert
- Use `POST /api/books/bulk` with a valid JWT and a body like:
  ```json
  {
    "books": [
      { "title": "Book 1", "author": "A" },
      { "title": "Book 2", "author": "B" }
    ]
  }
  ```
- Wait up to 2 minutes for the books to appear in `GET /api/books`.
