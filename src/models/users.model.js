import mongoose, { Schema } from 'mongoose'
const ObjectId = Schema.ObjectId

const User = new mongoose.Schema({
  _id: ObjectId,
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  role: { type: String, required: true },
  salt: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  deleted_at: { type: Date, default: null }
})
const UserModel = mongoose.model('User', User)
export { UserModel }
