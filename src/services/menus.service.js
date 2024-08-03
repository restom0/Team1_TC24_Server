import MenuItem from '../models/menus.model.js'
import mongoose, { Types } from 'mongoose'
import { RestaurantModel } from '../models/restaurants.model.js'
import { BadRequestError } from '../errors/badRequest.error.js'
import { NotFoundError } from '../errors/notFound.error.js'
const createMenuItem = async ({ code, name, category, description, unit, price, discount, restaurantID }) => {
  const restaurant = await RestaurantModel.find({
    _id: Types.ObjectId.createFromHexString(restaurantID),
    deleted_at: null
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
    created_at: new Date(),
    updated_at: new Date()
  })

  return await newMenuItem.save()
}

const getAllMenuItems = async (page, size) => {
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
      $skip: (page - 1) * size
    },
    {
      $limit: size
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

  return {
    data: items,
    info: {
      total: await MenuItem.countDocuments(),
      page,
      size,
      number_of_pages: Math.ceil((await MenuItem.countDocuments()) / size)
    }
  }
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
        updated_at: new Date()
      }
    },
    { new: true }
  )
}

const deleteMenuItemById = async (id) => {
  const item = await MenuItem.findByIdAndDelete(id)
  return item
}

const findMenuItemsByAnyField = async (searchTerm, page, size) => {
  const isObjectId = mongoose.Types.ObjectId.isValid(searchTerm)

  const query = {
    $or: [
      { _id: isObjectId ? Types.ObjectId.createFromHexString(searchTerm) : null },
      { code: { $regex: searchTerm, $options: 'i' } },
      { name: { $regex: searchTerm, $options: 'i' } },
      { category: { $regex: searchTerm, $options: 'i' } },
      { description: { $regex: searchTerm, $options: 'i' } },
      { unit: { $regex: searchTerm, $options: 'i' } },
      { price: isNaN(searchTerm) ? null : searchTerm },
      { discount: isNaN(searchTerm) ? null : searchTerm },
      { restaurant_id: isObjectId ? Types.ObjectId.createFromHexString(searchTerm) : null }
    ]
  }

  const menus = await MenuItem.find(query)
    .skip((page - 1) * size)
    .limit(size)
    .exec()
  const total = await MenuItem.countDocuments(query)
  return { data: menus, info: { total, number_of_pages: Math.ceil(total / size), page, size } }
}
const countMenu = async () => {
  return await MenuItem.countDocuments()
}

export const MenuService = {
  createMenuItem,
  getAllMenuItems,
  getMenuItemById,
  updateMenuItemById,
  deleteMenuItemById,
  findMenuItemsByAnyField,
  countMenu
}
