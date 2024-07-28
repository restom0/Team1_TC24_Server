import MenuItem from '../models/menus.model.js'
import mongoose, { Types } from 'mongoose'
import { RestaurantModel } from '../models/restaurants.model.js'
import { BadRequestError } from '../errors/badRequest.error.js'
import { NotFoundError } from '../errors/notFound.error.js'
const createMenuItem = async ({ code, name, category, description, unit, price, discount, restaurantID }) => {
  const restaurant = await RestaurantModel.find({
    _id: Types.ObjectId.createFromHexString(restaurantID),
    deletedAt: null
  })
  if (restaurant.length === 0) {
    throw new NotFoundError('Nhà hàng không tìm thấy')
  }

  const check = await MenuItem.find({
    code,
    restaurantID: Types.ObjectId.createFromHexString(restaurantID)
  })
  if (check.length > 0) {
    throw new BadRequestError('Món ăn đã tồn tại')
  }

  const newMenuItem = new MenuItem({
    _id: new mongoose.Types.ObjectId(),
    code,
    name,
    category,
    description,
    unit,
    price,
    discount,
    restaurant_id: Types.ObjectId.createFromHexString(restaurantID),
    createdAt: new Date(),
    updatedAt: new Date()
  })

  return await newMenuItem.save()
}

const getAllMenuItems = async () => {
  const items = await MenuItem.aggregate([
    {
      $lookup: {
        from: 'restaurants',
        localField: 'restaurant_id',
        foreignField: '_id',
        as: 'restaurant'
      }
    },
    {
      $unwind: '$restaurant'
    },
    {
      $project: {
        _id: 1,
        code: 1,
        name: 1,
        category: 1,
        description: 1,
        unit: 1,
        price: 1,
        discount: 1,
        restaurant: {
          name: 1,
          _id: 1
        }
      }
    }
  ])
  return items
}

const getMenuItemById = async (id) => {
  const item = await MenuItem.aggregate([
    {
      $match: {
        _id: Types.ObjectId.createFromHexString(id)
      }
    },
    {
      $lookup: {
        from: 'restaurants',
        localField: 'restaurant_id',
        foreignField: '_id',
        as: 'restaurant'
      }
    },
    {
      $unwind: '$restaurant'
    },
    {
      $project: {
        _id: 1,
        code: 1,
        name: 1,
        category: 1,
        description: 1,
        unit: 1,
        price: 1,
        discount: 1,
        restaurant: {
          name: 1,
          _id: 1
        }
      }
    }
  ])
  return item
}

const updateMenuItemById = async (id, { code, name, category, description, unit, price, discount }) => {
  return await MenuItem.findByIdAndUpdate(
    Types.ObjectId.createFromHexString(id),
    {
      $set: {
        code,
        name,
        category,
        description,
        unit,
        price,
        discount,
        updatedAt: new Date()
      }
    },
    { new: true }
  )
}

const deleteMenuItemById = async (id) => {
  const item = await MenuItem.findByIdAndDelete(id)
  return item
}

const findMenuItemsByAnyField = async (searchTerm) => {
  const isObjectId = mongoose.Types.ObjectId.isValid(searchTerm)

  const query = {
    $or: [
      ...(isObjectId ? [{ _id: new mongoose.Types.ObjectId(searchTerm) }] : []),
      { code: { $regex: searchTerm, $options: 'i' } },
      { name: { $regex: searchTerm, $options: 'i' } },
      { category: { $regex: searchTerm, $options: 'i' } },
      { description: { $regex: searchTerm, $options: 'i' } },
      { unit: { $regex: searchTerm, $options: 'i' } },
      { price: isNaN(searchTerm) ? null : searchTerm },
      { discount: isNaN(searchTerm) ? null : searchTerm },
      { restaurant_id: isObjectId ? new mongoose.Types.ObjectId(searchTerm) : null }
    ]
  }

  return await MenuItem.find(query).lean()
}

export const MenuService = {
  createMenuItem,
  getAllMenuItems,
  getMenuItemById,
  updateMenuItemById,
  deleteMenuItemById,
  findMenuItemsByAnyField
}
