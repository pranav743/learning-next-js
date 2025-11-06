# Blog Management System API

A RESTful API for managing blogs using Node.js, Express, and MongoDB.

## Features
- Create, read, update, and delete blog posts
- Filter blogs by category
- Increment views on blog retrieval
- Schema validation and error handling
- Modular MVC architecture

## Setup

1. **Clone the repository**
2. **Install dependencies**
	 ```sh
	 yarn install
	 ```
3. **Configure environment**
	 - Copy `.env` example:
		 ```
		 PORT=5000
		 MONGO_URI=mongodb://127.0.0.1:27017/blogDB
		 ```
4. **Start MongoDB** (if not already running)
5. **Run the server**
	 ```sh
	 yarn start
	 # or for development
	 yarn dev
	 ```

## API Endpoints

Base URL: `/api`

### Create Blog
- **POST** `/api/blogs`
- **Body:**
	```json
	{
		"title": "My First Blog",
		"content": "This is the content of the blog post...",
		"author": "John Doe",
		"category": "tech",
		"isPublished": true,
		"publishedAt": "2025-11-06T10:00:00Z"
	}
	```
- **Response:**
	```json
	{ "success": true, "data": { ...blog } }
	```

### Get All Blogs
- **GET** `/api/blogs`
- **Query:** `?category=tech` (optional)
- **Response:**
	```json
	{ "success": true, "data": [ ...blogs ] }
	```

### Get Blog by ID
- **GET** `/api/blogs/:id`
- **Response:**
	```json
	{ "success": true, "data": { ...blog } }
	```

### Update Blog
- **PATCH** `/api/blogs/:id`
- **Body:** (any updatable fields)
- **Response:**
	```json
	{ "success": true, "data": { ...blog } }
	```

### Delete Blog
- **DELETE** `/api/blogs/:id`
- **Response:**
	```json
	{ "success": true, "data": { ...blog } }
	```

## Error Response Example
```json
{ "success": false, "error": "Validation error message" }
```

## License
MIT
# learning-next-js
