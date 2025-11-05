import mongoose from 'mongoose'
const bookSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  author: { type: String, required: true },
  published: { type: Date },
  description: { type: String }
})
export default mongoose.model('Book', bookSchema)
