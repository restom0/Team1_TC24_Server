import axios from 'axios'
import { CommonUtils } from '../utils/common.util.js'
import { NotFoundError } from '../errors/notFound.error.js'
import { RestaurantModel } from '../models/restaurants.model.js'
import mongoose, { Types } from 'mongoose'
import RestaurantDto from '../dto/response/restaurant.dto.js'
import { GOOGLE_CONFIG } from '../configs/google.config.js'
import { TableModel } from '../models/tables.model.js'
import MenuItem from '../models/menus.model.js'

const getAllRestaurant = async (page) => {
  const restaurants = await RestaurantModel.aggregate([
    { $match: { deletedAt: null } },
    { $skip: (page - 1) * 5 },
    { $limit: 5 }
  ])
  return restaurants.map((restaurant) => new RestaurantDto(restaurant))
}
const getRestaurantById = async (id) => {
  const restaurant = await RestaurantModel.aggregate([
    { $match: { _id: Types.ObjectId.createFromHexString(id), deletedAt: null } },
    {
      $lookup: {
        from: 'users',
        localField: 'owner_id',
        foreignField: '_id',
        as: 'owner'
      }
    },
    { $unwind: '$owner' },
    {
      $project: {
        _id: 1,
        name: 1,
        address: 1,
        openTime: 1,
        closeTime: 1,
        description: 1,
        imageUrls: 1,
        slider1: 1,
        slider2: 1,
        slider3: 1,
        slider4: 1,
        owner: {
          _id: 1,
          name: 1,
          email: 1,
          phone: 1
        }
      }
    }
  ])
  const tables = await TableModel.find({ restaurantID: Types.ObjectId.createFromHexString(id), deletedAt: null })
  const menus = await MenuItem.find({ restaurant_id: Types.ObjectId.createFromHexString(id), deletedAt: null })
  return restaurant.length > 0
    ? {
        restaurant: new RestaurantDto(restaurant[0]),
        tables,
        menus
      }
    : null
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
  // Kiểm tra sự tồn tại của nhà hàng
  const existingRestaurant = await RestaurantModel.findOne({
    address,
    deletedAt: null
  })

  if (existingRestaurant) {
    throw new NotFoundError('Nhà hàng đã tồn tại')
  }

  // Tạo nhà hàng mới
  const newRestaurant = new RestaurantModel({
    _id: new mongoose.Types.ObjectId(),
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
    owner_id: new mongoose.Types.ObjectId(id.toString())
  })

  // Lưu nhà hàng mới vào cơ sở dữ liệu
  await newRestaurant.save()

  return new RestaurantDto(newRestaurant)
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
  // Tìm nhà hàng theo ID
  const restaurant = await getRestaurantById(id)

  if (!restaurant || restaurant.deletedAt) {
    throw new NotFoundError('Nhà hàng không tìm thấy')
  }

  // Cập nhật nhà hàng
  const result = await RestaurantModel.updateOne(
    { _id: Types.ObjectId.createFromHexString(id) },
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

  // Kiểm tra kết quả cập nhật
  if (result.modifiedCount === 0) {
    throw new NotFoundError('Nhà hàng không được cập nhật')
  }

  // Trả về nhà hàng đã cập nhật
  return await RestaurantModel.findById(id)
}

const deleteRestaurant = async (id) => {
  const restaurant = await RestaurantModel.findById(id)
  if (CommonUtils.checkNullOrUndefined(restaurant)) {
    throw new NotFoundError('Restaurant not found')
  }
  return await RestaurantModel.updateOne(
    { _id: Types.ObjectId.createFromHexString(id), deletedAt: null },
    { deletedAt: new Date() }
  )
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
    $and: [
      {
        $or: [
          ...(isObjectId ? [{ _id: new mongoose.Types.ObjectId(searchTerm) }] : []),
          { name: { $regex: searchTerm, $options: 'i' } },
          { address: { $regex: searchTerm, $options: 'i' } },
          { openTime: { $regex: searchTerm, $options: 'i' } },
          { closeTime: { $regex: searchTerm, $options: 'i' } }
        ]
      },
      { deletedAt: null } // Chỉ trả về nhà hàng không bị xóa
    ]
  }

  return await RestaurantModel.find(query).lean()
}
const countRestaurant = async () => {
  const result = await RestaurantModel.countDocuments()

  return result
}
export const RestaurantService = {
  getAllRestaurant,
  getRestaurantById,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
  getFourNearestRestaurant,
  getDistanceFromRestaurant,
  findRestaurantsByAnyField,
  countRestaurant
}
