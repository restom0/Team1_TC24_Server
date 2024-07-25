import mongoose, { Schema } from 'mongoose'
const ObjectId = Schema.ObjectId

const Restaurant = new Schema(
  {
    _id: ObjectId,
    name: { type: String, required: true },
    address: { type: String, required: true },
    menu_id: { type: [ObjectId], refs: 'Menus', required: true },
    openTime: { type: Number, required: true },
    closeTime: { type: Number, required: true },
    description: { type: String, required: true },
    imageUrls: { type: String, required: true },
    createdAt: { type: Date, required: true, default: Date.now },
    updatedAt: { type: Date, required: true, default: Date.now },
    deletedAt: { type: Date, default: null }
  },
  { timestamps: true }
)
const RestaurantModel = mongoose.model('Restaurants', Restaurant)

export { RestaurantModel }
