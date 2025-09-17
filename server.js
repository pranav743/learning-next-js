const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const DB_PATH = path.join(__dirname, 'db.json');

// Middleware
app.use(express.json());

// Helper function to read the database
const readDatabase = () => {
  try {
    const data = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading database:', error);
    return { books: [] };
  }
};

// Helper function to write to the database
const writeDatabase = (data) => {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing database:', error);
    return false;
  }
};

// Helper function to get next ID
const getNextId = (books) => {
  if (books.length === 0) return 1;
  return Math.max(...books.map(book => book.id)) + 1;
};

// CRUD Operations

// GET /books - Fetch all books
app.get('/books', (req, res) => {
  const data = readDatabase();
  res.status(200).json(data.books);
});

// GET /books/:id - Fetch a single book by id
app.get('/books/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const data = readDatabase();
  const book = data.books.find(b => b.id === id);
  
  if (!book) {
    return res.status(404).json({ message: 'Book not found' });
  }
  
  res.status(200).json(book);
});

// POST /books - Add a new book
app.post('/books', (req, res) => {
  const { title, author, year } = req.body;
  
  // Validation
  if (!title || !author || !year) {
    return res.status(400).json({ 
      message: 'Missing required fields. Title, author, and year are required.' 
    });
  }
  
  if (typeof year !== 'number' || year < 0) {
    return res.status(400).json({ 
      message: 'Year must be a valid positive number.' 
    });
  }
  
  const data = readDatabase();
  const newBook = {
    id: getNextId(data.books),
    title,
    author,
    year
  };
  
  data.books.push(newBook);
  
  if (writeDatabase(data)) {
    res.status(201).json(newBook);
  } else {
    res.status(500).json({ message: 'Error saving book' });
  }
});

// PUT /books/:id - Update a book
app.put('/books/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { title, author, year } = req.body;
  
  const data = readDatabase();
  const bookIndex = data.books.findIndex(b => b.id === id);
  
  if (bookIndex === -1) {
    return res.status(404).json({ message: 'Book not found' });
  }
  
  // Validation for provided fields
  if (year !== undefined && (typeof year !== 'number' || year < 0)) {
    return res.status(400).json({ 
      message: 'Year must be a valid positive number.' 
    });
  }
  
  // Update only provided fields
  if (title !== undefined) data.books[bookIndex].title = title;
  if (author !== undefined) data.books[bookIndex].author = author;
  if (year !== undefined) data.books[bookIndex].year = year;
  
  if (writeDatabase(data)) {
    res.status(200).json(data.books[bookIndex]);
  } else {
    res.status(500).json({ message: 'Error updating book' });
  }
});

// DELETE /books/:id - Delete a book
app.delete('/books/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const data = readDatabase();
  const bookIndex = data.books.findIndex(b => b.id === id);
  
  if (bookIndex === -1) {
    return res.status(404).json({ message: 'Book not found' });
  }
  
  const deletedBook = data.books.splice(bookIndex, 1)[0];
  
  if (writeDatabase(data)) {
    res.status(200).json({ 
      message: 'Book deleted successfully', 
      deletedBook 
    });
  } else {
    res.status(500).json({ message: 'Error deleting book' });
  }
});

// Dynamic Routing

// GET /books/author/:authorName - Fetch all books by a given author
app.get('/books/author/:authorName', (req, res) => {
  const authorName = req.params.authorName;
  const data = readDatabase();
  
  // Case-insensitive search
  const booksByAuthor = data.books.filter(book => 
    book.author.toLowerCase().includes(authorName.toLowerCase())
  );
  
  if (booksByAuthor.length === 0) {
    return res.status(404).json({
      success: false,
      message: 'No books found for this author'
    });
  }
  
  res.status(200).json(booksByAuthor);
});

// GET /books/year/:year - Fetch all books published in a specific year
app.get('/books/year/:year', (req, res) => {
  const year = parseInt(req.params.year);
  const data = readDatabase();
  
  if (isNaN(year)) {
    return res.status(400).json({ message: 'Invalid year format' });
  }
  
  const booksByYear = data.books.filter(book => book.year === year);
  
  if (booksByYear.length === 0) {
    return res.status(404).json({
      success: false,
      message: `No books found for year ${year}`
    });
  }
  
  res.status(200).json(booksByYear);
});

// GET /books/search/:keyword - Search books by keyword in title or author
app.get('/books/search/:keyword', (req, res) => {
  const keyword = req.params.keyword.toLowerCase();
  const data = readDatabase();
  
  const matchingBooks = data.books.filter(book => 
    book.title.toLowerCase().includes(keyword) || 
    book.author.toLowerCase().includes(keyword)
  );
  
  if (matchingBooks.length === 0) {
    return res.status(404).json({
      success: false,
      message: `No books found matching keyword '${req.params.keyword}'`
    });
  }
  
  res.status(200).json(matchingBooks);
});

// Default route
app.get('/', (req, res) => {
  res.json({
    message: 'Book Management API',
    endpoints: {
      'GET /books': 'Get all books',
      'GET /books/:id': 'Get book by ID',
      'POST /books': 'Create new book',
      'PUT /books/:id': 'Update book',
      'DELETE /books/:id': 'Delete book',
      'GET /books/author/:authorName': 'Get books by author',
      'GET /books/year/:year': 'Get books by year',
      'GET /books/search/:keyword': 'Search books by keyword'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Book Management API is running on http://localhost:${PORT}`);
  console.log('Available endpoints:');
  console.log('- GET /books (Get all books)');
  console.log('- GET /books/:id (Get book by ID)');
  console.log('- POST /books (Create new book)');
  console.log('- PUT /books/:id (Update book)');
  console.log('- DELETE /books/:id (Delete book)');
  console.log('- GET /books/author/:authorName (Get books by author)');
  console.log('- GET /books/year/:year (Get books by year)');
  console.log('- GET /books/search/:keyword (Search books by keyword)');
});