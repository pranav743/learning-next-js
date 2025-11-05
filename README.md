
# Books Management API

## Features
- User authentication (JWT)
- CRUD for books (per user)
- Redis caching for GET /books (per user)
- Bulk books insertion via Redis + cron job
- MongoDB (Mongoose)
- Bulk insertion status tracking and PDF/email reporting (multiuser-safe)

## Setup

### 1. Install dependencies

```
yarn install
```

### 2. Configure environment

Copy `.env.example` to `.env` and set values as needed. For email reporting, set SMTP credentials (Mailtrap or your SMTP server):

```
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=your_user
SMTP_PASS=your_pass
EMAIL_FROM=noreply@booksapp.com
```

### 3. Start MongoDB

Ensure MongoDB is running locally or update `MONGO_URI` in `.env`.

### 4. (Optional) Start Redis

- If Redis is not running, caching, bulk jobs, and reporting will be skipped gracefully.
- To run Redis locally:
  - On macOS: `brew install redis && brew services start redis`
  - Or use Docker: `docker run -p 6379:6379 redis`

### 5. Start the server

```
yarn dev
```

## API Endpoints

### Auth
- `POST /api/signup` { username, password, email }
- `POST /api/login` { username, password }

### Books (JWT required)
- `GET /api/books` — List all books (cached)
- `POST /api/books` — Add a book
- `PUT /api/books/:id` — Update a book
- `DELETE /api/books/:id` — Delete a book
- `POST /api/books/bulk` — Bulk add books (array)

## Bulk Books Insertion & Reporting Flow
1. Send `POST /api/books/bulk` with `{ books: [ ... ] }` (array of book objects).
2. Books are stored in Redis under your user key.
3. Every 2 minutes, a background cron job reads all users' pending bulk books from Redis and inserts them into MongoDB. After processing, a status record is stored in Redis per user with success/failure counts and timestamp.
4. Every 5 minutes, a second cron job reads all user status records, generates a PDF report, and emails it to the user's registered email. On success, the status record is deleted from Redis.

## Simulating and Verifying Reporting
- Register with a real or Mailtrap email address.
- Use `POST /api/books/bulk` as below:
  ```json
  {
    "books": [
      { "title": "Book 1", "author": "A" },
      { "title": "Book 2", "author": "B" }
    ]
  }
  ```
- Wait up to 2 minutes for processing, then up to 5 minutes for the PDF report email.
- Check your email inbox for a PDF attachment summarizing the bulk operation.

## Viewing Redis Status Tracking
- Each user's bulk insertion status is stored in Redis under `user:<userId>:bulkstatus` until the report is emailed.
- Use `redis-cli` or a Redis GUI to inspect these keys.

## Logging
- All cron job events and errors are logged to `jobs.log` in the project root.

## Notes
- Redis keys are always scoped per user.
- If Redis is unavailable, caching, bulk jobs, and reporting are skipped without crashing the app.
- Both cron jobs are non-blocking and multiuser-safe.
- All validation and error handling is enforced.
