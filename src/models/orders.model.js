import mongoose, { Schema } from 'mongoose'
import { PAYMENT_STATUS } from '../constants/payment_status.constant.js'
import { PAYMENT_METHOD } from '../constants/payment_method.constant.js'
const ObjectId = Schema.ObjectId
const Order = new Schema(
  {
    _id: ObjectId,
    userId: { type: ObjectId, ref: 'Users', required: true },
    tableId: { type: ObjectId, ref: 'Tables', required: true },
    totalTable: { type: Number, required: true },
    name: { type: String, required: true },
    phone_number: { type: String, required: true },
    payment: { type: String, require: true, enum: PAYMENT_METHOD },
    menuList: { type: [Object], required: true },
    status: { type: String, required: true, enum: PAYMENT_STATUS },
    checkin: { type: Date, required: true },
    orderCode: { type: Number, default: Number(String(new Date().getTime()).slice(-6)) },
    checkout: { type: Date, required: true, default: null },
    createdAt: { type: Date, required: true, default: Date.now },
    updatedAt: { type: Date, required: true, default: Date.now },
    deletedAt: { type: Date, default: null },
    restaurantId: { type: ObjectId, ref: 'Restaurants', required: true }
  },
  { timestamps: true }
)
const OrderModel = mongoose.model('Orders', Order)

export { OrderModel }
