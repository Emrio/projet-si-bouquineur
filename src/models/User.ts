import mongoose from 'mongoose'

export interface User extends mongoose.Document {
  username: string
  rfid: string
}

export const User = mongoose.model<User>('User', new mongoose.Schema({
  username: String,
  rfid: String
}))
