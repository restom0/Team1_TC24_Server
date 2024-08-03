import axios from 'axios'
import { CommonUtils } from '../utils/common.util.js'
import { NotFoundError } from '../errors/notFound.error.js'
import { TableModel } from '../models/tables.model.js'
import mongoose, { Types } from 'mongoose'
import { RestaurantModel } from '../models/restaurants.model.js'
import { BadRequestError } from '../errors/badRequest.error.js'
const getAllTable = async (page, size) => {
  const tables = await TableModel.aggregate([
    {
      $match: {
        deleted_at: { $eq: null }
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
      $skip: (page - 1) * size
    },
    {
      $limit: size
    },
    {
      $project: {
        _id: 1,
        restaurant: '$restaurant',
        number_of_tables: 1,
        people_per_table: 1
      }
    }
  ]).exec()
  const count = await TableModel.countDocuments({ deleted_at: { $eq: null } }).exec()
  return { data: tables, info: { total: count, page, size, number_of_pages: Math.ceil(count / size) } }
}

const getTableById = async (id) => {
  return await TableModel.aggregate([
    {
      $match: {
        _id: Types.ObjectId.createFromHexString(id),
        deleted_at: null
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
      $group: {
        _id: '$restaurant_id',
        restaurant: { $first: '$restaurant' },
        number_of_tables: { $first: '$number_of_tables' },
        people_per_table: { $first: '$people_per_table' }
      }
    },
    {
      $project: {
        _id: 1,
        restaurant: '$restaurant',
        number_of_tables: 1,
        people_per_table: 1
      }
    }
  ]).exec()
}
const createTable = async ({ number_of_tables, people_per_table, restaurant_id }) => {
  const restaurant = await RestaurantModel.find({
    _id: Types.ObjectId.createFromHexString(restaurant_id),
    deleted_at: null
  }).orFail(new NotFoundError('Nhà hàng không tìm thấy'))
  const newTable = new TableModel({
    _id: new mongoose.Types.ObjectId(),
    number_of_tables,
    people_per_table,
    restaurant_id: Types.ObjectId.createFromHexString(restaurant_id)
  })
  return await newTable.save()
}

const updateTable = async (id, { number_of_tables, people_per_table }) => {
  return await TableModel.findByIdAndUpdate(
    Types.ObjectId.createFromHexString(id),
    {
      $set: {
        number_of_tables,
        people_per_table,
        updated_at: new Date()
      }
    },
    { new: true }
  )
}
const deleteTable = async (id) => {
  const table = await TableModel.find({ _id: id, deleted_at: { $eq: null } })

  if (table.length === 0) {
    throw new NotFoundError('Table not found')
  }
  return await TableModel.findByIdAndUpdate(Types.ObjectId.createFromHexString(id), { deleted_at: Date.now() })
}
const findTablesByAnyField = async (searchTerm, page, size) => {
  const isObjectId = mongoose.Types.ObjectId.isValid(searchTerm)

  const query = {
    $or: [
      { _id: isObjectId ? Types.ObjectId.createFromHexString(searchTerm) : null },
      { number_of_tables: { $regex: searchTerm, $options: 'i' } },
      { people_per_table: { $regex: searchTerm, $options: 'i' } },
      { restaurant_id: isObjectId ? Types.ObjectId.createFromHexString(searchTerm) : null }
    ]
  }

  const tables = await TableModel.find(query)
    .skip((page - 1) * size)
    .limit(size)
    .exec()
  const count = await TableModel.countDocuments(query)
  return { data: tables, info: { total: count, page, size, number_of_pages: Math.ceil(count / size) } }
}

export const TableService = {
  getAllTable,
  getTableById,
  createTable,
  updateTable,
  deleteTable,
  findTablesByAnyField
}
