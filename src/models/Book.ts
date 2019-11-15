import mongoose from 'mongoose'
import { User } from './User'

export interface Book extends mongoose.Document {
  bookId: string
  title: string
  author: string
  summary: string
  usedBy: User | null
  dateUsedBy: Date
}

export const Book = mongoose.model<Book>('Book', new mongoose.Schema({
  bookId: String,
  title: String,
  author: String,
  summary: String,
  usedBy: { type: mongoose.Types.ObjectId, ref: 'User' },
  dateUsedBy: Date,
}))

export async function getLibrary (): Promise<Book[]> {
  const library = await Book.find()
  return Promise.all(library.map(book => book.populate('usedBy').execPopulate()))
}

export async function getBorrowed (userId: mongoose.Types.ObjectId): Promise<Book[]> {
  return Book.find({ usedBy: userId })
}

export async function getBook (bookId: string): Promise<Book | null> {
  const book = await Book.findOne({ bookId })
  return book
}

export async function setBookStatus (bookId: mongoose.Types.ObjectId, owner: mongoose.Types.ObjectId | null, date?: Date): Promise<void> {
  const query = { $set: date ? { usedBy: owner || undefined, date } : { usedBy: owner || undefined } }
  console.log({ query }, { bookId })
  await Book.updateOne({ _id: bookId }, query)
  return
}
