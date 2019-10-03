import mongoose from 'mongoose'

export interface Book extends mongoose.Document {
  bookId: number
  title: string
  author: string
  summary: string
}

export const Book = mongoose.model<Book>('Book', new mongoose.Schema({
  bookId: String,
  title: String,
  author: String,
  summary: String
}))
