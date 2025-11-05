import Book from '../models/Book.js'
async function getBooksByUser(userId) {
  return Book.find({ user: userId })
}
async function addBook(userId, data) {
  return Book.create({ ...data, user: userId })
}
async function updateBook(userId, bookId, data) {
  return Book.findOneAndUpdate({ _id: bookId, user: userId }, data, { new: true })
}
async function deleteBook(userId, bookId) {
  return Book.findOneAndDelete({ _id: bookId, user: userId })
}
async function addBooksBulk(userId, books) {
  const docs = books.map(b => ({ ...b, user: userId }))
  return Book.insertMany(docs)
}
export { getBooksByUser, addBook, updateBook, deleteBook, addBooksBulk }
