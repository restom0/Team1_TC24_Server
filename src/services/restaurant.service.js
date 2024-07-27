import axios from 'axios'
import { CommonUtils } from '../utils/common.util.js'
import { NotFoundError } from '../errors/notFound.error.js'
import { RestaurantModel } from '../models/restaurants.model.js'
import mongoose from 'mongoose'
import RestaurantDto from '../dto/response/restaurant.dto.js'
import { GOOGLE_CONFIG } from '../configs/google.config.js'

const getAllRestaurant = async () => {
  const restaurants = await RestaurantModel.find({ deletedAt: null })
  return restaurants.map((restaurant) => new RestaurantDto(restaurant))
}
const getRestaurantById = async (id) => {
  return new RestaurantDto(await RestaurantModel.findById(id, { deletedAt: null }))
}

const getLatLngFromAddress = async (address) => {
  try {
    const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
      params: {
        address,
        key: GOOGLE_CONFIG.GOOGLE_API_KEY
      }
    })

    if (response.data.status === 'OK') {
      const location = response.data.results[0].geometry.location
      return {
        latitude: location.lat,
        longitude: location.lng
      }
    } else if (response.data.status === 'REQUEST_DENIED') {
      console.log(response.data)
      throw new Error('Geocoding API request denied. Please check your API key and permissions.')
    } else {
      throw new Error(`Geocoding API error: ${response.data.status}`)
    }
  } catch (error) {
    console.error('Error fetching geocode:', error.message)
    throw error
  }
}

const createRestaurant = async (
  id,
  {
    name,
    address,
    openTime,
    closeTime,
    description,
    imageUrls,
    slider1,
    slider2,
    slider3,
    slider4,
    public_id_avatar,
    public_id_slider1,
    public_id_slider2,
    public_id_slider3,
    public_id_slider4
  }
) => {
  // const { latitude, longitude } = await getLatLngFromAddress(address)
  const restaurant = await RestaurantModel.find({
    name,
    address,
    // latitude,
    // longitude,
    openTime,
    closeTime,
    description,
    imageUrls,
    deletedAt: null,
    public_id_avatar,
    public_id_slider1,
    public_id_slider2,
    public_id_slider3,
    public_id_slider4
  })
  if (restaurant.length > 0) {
    throw new NotFoundError('Restaurant already exists')
  }
  return new RestaurantDto(
    await RestaurantModel.create({
      _id: new mongoose.Types.ObjectId(),
      name,
      address,
      // latitude,
      // longitude,
      openTime,
      closeTime,
      menu_id: [],
      description,
      imageUrls,
      slider1,
      slider2,
      slider3,
      slider4,
      public_id_avatar,
      public_id_slider1,
      public_id_slider2,
      public_id_slider3,
      public_id_slider4,
      owner_id: new mongoose.Types.ObjectId(id.toString())
    })
  )
}

const updateRestaurant = async (
  id,
  {
    name,
    address,
    openTime,
    closeTime,
    description,
    imageUrls,
    slider1,
    slider2,
    slider3,
    slider4,
    public_id_avatar,
    public_id_slider1,
    public_id_slider2,
    public_id_slider3,
    public_id_slider4
  }
) => {
  const restaurant = await RestaurantModel.findById(id, { deletedAt: null })
  if (restaurant.length === 0) {
    throw new NotFoundError('Restaurant not found')
  }
  return await RestaurantModel.updateOne(
    { _id: mongoose.Types.ObjectId(id) },
    {
      name,
      address,
      openTime,
      closeTime,
      description,
      imageUrls,
      slider1,
      slider2,
      slider3,
      slider4,
      public_id_avatar,
      public_id_slider1,
      public_id_slider2,
      public_id_slider3,
      public_id_slider4,
      updatedAt: Date.now()
    }
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
  try {
    const response = await axios.get('https://maps.googleapis.com/maps/api/distancematrix/json', {
      params: {
        origins: origin,
        destinations: destination,
        units: 'metric',
        key: GOOGLE_CONFIG.GOOGLE_API_KEY
      }
    })

    const distance = response.data.rows[0].elements[0].distance.text
    return distance
  } catch (error) {
    console.error('Error calculating distance:', error)
    throw error
  }
}
const getFourNearestRestaurant = async (latitude, longitude) => {
  const restaurants = await RestaurantModel.find({ deletedAt: null })
  const restaurantWithDistance = []
  for (const restaurant of restaurants) {
    const distance = await calculateDistance(
      `${latitude},${longitude}`,
      `${restaurant.latitude},${restaurant.longitude}`
    )
    restaurantWithDistance.push({ ...restaurant._doc, distance })
  }
  return restaurantWithDistance
}

const getDistanceFromRestaurant = async (restaurantId, latitude, longitude) => {
  const restaurant = await RestaurantModel.findById(restaurantId)
  return await calculateDistance(`${latitude},${longitude}`, `${restaurant.latitude},${restaurant.longitude}`)
}
const findRestaurantsByAnyField = async (searchTerm) => {
  // Kiểm tra nếu searchTerm là một ObjectId hợp lệ
  const isObjectId = mongoose.Types.ObjectId.isValid(searchTerm)

  // Tạo truy vấn tìm kiếm
  const query = {
    $or: [
      ...(isObjectId ? [{ _id: new mongoose.Types.ObjectId(searchTerm) }] : []),
      { name: { $regex: searchTerm, $options: 'i' } },
      { address: { $regex: searchTerm, $options: 'i' } },
      { openTime: { $regex: searchTerm, $options: 'i' } },
      { closeTime: { $regex: searchTerm, $options: 'i' } }
    ]
  }

  return await RestaurantModel.find(query).lean()
}
export const RestaurantService = {
  getAllRestaurant,
  getRestaurantById,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
  getFourNearestRestaurant,
  getDistanceFromRestaurant,
  findRestaurantsByAnyField
}
