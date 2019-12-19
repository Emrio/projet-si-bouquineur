import mongoose from 'mongoose'
import { User } from './User'
import { Book, setBookStatus } from './Book'

export type Action = 'WITHDRAW' | 'RETURN'

export interface Update extends mongoose.Document {
  book: Book
  action: Action
  user: User
  date: Date
}

export const Update = mongoose.model<Update>('Update', new mongoose.Schema({
  book: { type: mongoose.Types.ObjectId, ref: 'Book' },
  action: String,
  user: { type: mongoose.Types.ObjectId, ref: 'User' },
  date: { type: Date, default: Date.now }
}))

export async function getUserHistory (id: mongoose.Types.ObjectId): Promise<Update[]> {
  const updates = await Update.find({ user: id })
  return await Promise.all(updates.map(update => update.populate('book').execPopulate()))
}

export async function updateBookStatus (book: mongoose.Types.ObjectId, user: mongoose.Types.ObjectId, action: Action): Promise<Update> {
  const update = new Update({ book, user, action })
  await update.save()
  await setBookStatus(book, action === 'WITHDRAW' ? user : null, action === 'WITHDRAW' ? new Date() : undefined)
  return update
}
