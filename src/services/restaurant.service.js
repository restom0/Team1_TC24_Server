import axios from 'axios'
import { CommonUtils } from '../utils/common.util.js'
import { NotFoundError } from '../errors/notFound.error.js'
import { RestaurantModel } from '../models/restaurants.model.js'
import mongoose from 'mongoose'
import { RestaurantDto } from '../dto/response/restaurant.dto.js'
// name: { type: String, required: true },
//     address: { type: String, required: true },
//     openTime: { type: Number, required: true },
//     closeTime: { type: Number, required: true },
//     description: { type: String, required: true },
//     imageUrls: { type: String, required: true },
const getAllRestaurant = async () => {
  return RestaurantDto(await RestaurantModel.find({ deletedAt: null }))
}
const getRestaurantById = async (id) => {
  return RestaurantDto(await RestaurantModel.findById(id, { deletedAt: null }))
}

const createRestaurant = async ({ name, address, openTime, closeTime, description, imageUrls }) => {
  const restaurant = await RestaurantModel.find({
    name,
    address,
    openTime,
    closeTime,
    description,
    imageUrls,
    deletedAt: null
  })
  if (!CommonUtils.checkNullOrUndefined(restaurant)) {
    throw new NotFoundError('Restaurant already exists')
  }
  return RestaurantDto(await RestaurantModel.create({ name, address, openTime, closeTime, description, imageUrls }))
}

const updateRestaurant = async (id, { name, address, openTime, closeTime, description, imageUrls }) => {
  const restaurant = await RestaurantModel.findById(id, { deletedAt: null })
  if (CommonUtils.checkNullOrUndefined(restaurant)) {
    throw new NotFoundError('Restaurant not found')
  }
  return await RestaurantModel.updateOne(
    { _id: mongoose.Types.ObjectId(id) },
    { name, address, openTime, closeTime, description, imageUrls }
  )
}

const deleteRestaurant = async (id) => {
  const restaurant = await RestaurantModel.findById(id)
  if (CommonUtils.checkNullOrUndefined(restaurant)) {
    throw new NotFoundError('Restaurant not found')
  }
  return await RestaurantModel.findByIdAndUpdate({ _id: mongoose.Types.ObjectId(id), deletedAt: new Date() })
}

const calculateDistance = async (origin, destination) => {
  const distance = await axios.get(`https://maps.googleapis.com/maps/api/distancematrix/json
  ?destinations=New%20York%20City%2C%20NY
  &origins=Washington%2C%20DC
  &units=imperial
  &key=YOUR_API_KEY`)
  return 0
}
export const RestaurantService = {
  getAllRestaurant,
  getRestaurantById,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
  calculateDistance
}
