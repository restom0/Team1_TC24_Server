import mongoose, { Schema } from 'mongoose'
const ObjectId = Schema.ObjectId

const Restaurant = new Schema(
  {
    _id: ObjectId,
    name: { type: String, required: true },
    // latitude: { type: String, required: true },
    // longitude: { type: String, required: true },
    address: { type: String, required: true },
    openTime: { type: String, required: true },
    closeTime: { type: String, required: true },
    description: { type: String, required: true },
    imageUrls: { type: String, required: true },
    slider1: { type: String, required: true },
    slider2: { type: String, required: true },
    slider3: { type: String, required: true },
    slider4: { type: String, required: true },
    public_id_avatar: { type: String, required: true },
    public_id_slider1: { type: String, required: true },
    public_id_slider2: { type: String, required: true },
    public_id_slider3: { type: String, required: true },
    public_id_slider4: { type: String, required: true },
    createdAt: { type: Date, required: true, default: Date.now },
    updatedAt: { type: Date, required: true, default: Date.now },
    owner_id: { type: ObjectId, refs: 'Users', required: true },
    deletedAt: { type: Date, default: null }
  },
  { timestamps: true }
)
const RestaurantModel = mongoose.model('Restaurants', Restaurant)

export { RestaurantModel }
