import mongoose, { Schema } from 'mongoose'
const ObjectId = Schema.ObjectId
const Table = new Schema({
  _id: ObjectId,
  tableNumber: { type: Number, required: true },
  status: { type: Boolean, required: true },
  restaurantID: { type: ObjectId, ref: 'Restaurants', required: true },
  createdAt: { type: Date, required: true, default: Date.now },
  updatedAt: { type: Date, required: true, default: Date.now },
  deletedAt: { type: Date, default: null }
})
const TableModel = mongoose.model('Tables', Table)

export { TableModel }
