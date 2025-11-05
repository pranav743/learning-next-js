import mongoose from 'mongoose'
const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/booksapp'
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
}
export default connectDB
