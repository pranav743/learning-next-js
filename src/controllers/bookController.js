import { getBooksByUser, addBook, updateBook, deleteBook, addBooksBulk } from '../services/bookService.js'
import { getBooksCache, setBooksCache, invalidateBooksCache, storeBulkBooks } from '../services/redisService.js'
async function listBooks(req, res) {
  const userId = req.user._id.toString()
  const cached = await getBooksCache(userId)
  if (cached) return res.json(cached)
  const books = await getBooksByUser(userId)
  await setBooksCache(userId, books)
  res.json(books)
}
async function createBook(req, res) {
  const userId = req.user._id.toString()
  const book = await addBook(userId, req.body)
  await invalidateBooksCache(userId)
  res.status(201).json(book)
}
async function updateBookById(req, res) {
  const userId = req.user._id.toString()
  const book = await updateBook(userId, req.params.id, req.body)
  if (!book) return res.status(404).json({ error: 'Not found' })
  await invalidateBooksCache(userId)
  res.json(book)
}
async function deleteBookById(req, res) {
  const userId = req.user._id.toString()
  const book = await deleteBook(userId, req.params.id)
  if (!book) return res.status(404).json({ error: 'Not found' })
  await invalidateBooksCache(userId)
  res.json({ success: true })
}
async function bulkBooks(req, res) {
  const userId = req.user._id.toString()
  const books = req.body.books
  if (!Array.isArray(books) || books.length === 0) return res.status(400).json({ error: 'Invalid books array' })
  await storeBulkBooks(userId, books)
  res.json({ message: 'Books will be added later.' })
}
export { listBooks, createBook, updateBookById, deleteBookById, bulkBooks }
