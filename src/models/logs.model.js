import mongoose, { Schema } from 'mongoose'
const ObjectId = Schema.ObjectId

const Log = new Schema({
  _id: ObjectId,
  userID: { type: ObjectId, ref: 'Users', required: true },
  activity: { type: String, required: true },
  createdAt: { type: Date, required: true, default: Date.now }
})
const LogModel = mongoose.model('Logs', Log)

export { LogModel }
