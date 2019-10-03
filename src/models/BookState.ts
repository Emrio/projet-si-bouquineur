import mongoose from 'mongoose'
import { User } from './User'

export interface BookState extends mongoose.Document {
  bookId: number
  usedBy: User | null
  dateUsedBy: Date | null
}

export const BookState = mongoose.model<BookState>('BookState', new mongoose.Schema({
  bookId: String,
  usedBy: User.schema,
  dateUsedBy: Date
}))
