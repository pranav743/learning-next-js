# Blog Management API

A RESTful API for managing blogs using Node.js, Express, and MVC architecture. Supports CRUD operations with image uploads, stored in a JSON file.

## Features
- MVC pattern with file-based storage
- Image upload via Multer
- Input validation and error handling
- RESTful endpoints

## Project Structure
```
├── controllers/ (blogController.js, imageController.js)
├── middlewares/ (validateBlog.js)
├── models/ (blogModel.js)
├── routes/ (blogRoutes.js, imageRoutes.js)
├── uploads/ (images)
├── db.json (data)
├── server.js
└── package.json
```

## Installation
1. Clone repo
2. `yarn install`
3. `yarn start`
API at `http://localhost:3000`

## API Endpoints
- **POST** `/blogs/create` - Create blog (title, content, image optional)
- **GET** `/blogs/` - Get all blogs
- **GET** `/blogs/:id` - Get blog by ID
- **PUT** `/blogs/:id` - Update blog
- **DELETE** `/blogs/:id` - Delete blog
- **GET** `/images/:filename` - Serve image

## Data Structure
Blog: `{id, title, content, image}`
DB: `{"blogs": [blog objects]}`

## Middleware
- Built-in: JSON parsing, static files
- Custom: Validation
- External: Multer (5MB limit, JPEG/PNG/GIF/WebP)

## Error Handling
- 400: Bad request
- 404: Not found
- 500: Server error

## Example Usage
```bash
curl -X POST http://localhost:3000/blogs/create -F "title=Title" -F "content=Content" -F "image=@image.jpg"
curl http://localhost:3000/blogs/
```

## Technologies
Node.js, Express, Multer, fs, path

## Notes
- Auto-incrementing IDs
- Local image storage
- Images deleted on blog removal
