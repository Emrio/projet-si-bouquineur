import mongoose from 'mongoose'
import { User } from './User'

export interface Update extends mongoose.Document {
  bookId: number
  action: 'WITHDRAW' | 'RETURN'
  user: User
  date: Date
}

export const Update = mongoose.model<Update>('Update', new mongoose.Schema({
  bookId: String,
  action: String,
  user: User.schema,
  date: Date
}))
