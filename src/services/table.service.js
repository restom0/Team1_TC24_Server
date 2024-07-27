import axios from 'axios'
import { CommonUtils } from '../utils/common.util.js'
import { NotFoundError } from '../errors/notFound.error.js'
import { TableModel } from '../models/tables.model.js'
import mongoose, { Types } from 'mongoose'

const getAllTable = async () => {
  return await TableModel.aggregate([
    {
      $match: {
        deletedAt: null
      }
    },
    {
      $lookup: {
        from: 'restaurants',
        localField: 'restaurantId',
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
        restaurantId: 1,
        restaurantName: '$restaurant.name',
        name: 1,
        status: 1,
        createdAt: 1,
        updatedAt: 1
      }
    }
  ])
}

const getTableById = async (id) => {
  return await TableModel.aggregate([
    {
      $match: {
        _id: mongoose.Types.ObjectId(id),
        deletedAt: null
      }
    },
    {
      $lookup: {
        from: 'restaurants',
        localField: 'restaurantId',
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
        restaurantId: 1,
        restaurantName: '$restaurant.name',
        name: 1,
        status: 1,
        createdAt: 1,
        updatedAt: 1
      }
    }
  ])
}
// _id: ObjectId,
//   tableNumber: { type: Number, required: true },
//   status: { type: Boolean, required: true },
//   restaurantID: { type: ObjectId, ref: 'Restaurants', required: true },
//   createdAt: { type: Date, required: true, default: Date.now },
//   updatedAt: { type: Date, required: true, default: Date.now },
//   deletedAt: { type: Date, default: null }
const createTable = async ({ tableNumber, restaurantID }) => {
  return await TableModel.create({ tableNumber, status: true, restaurantID })
}

const updateTable = async (id, { tableNumber }) => {
  return await TableModel.findByIdAndUpdate(mongoose.Types.ObjectId(id), {
    tableNumber,
    updatedAt: Date.now()
  })
}

const deleteTable = async (id) => {
  const table = await TableModel.findById(id, { deletedAt: null })
  if (!table) {
    throw new NotFoundError('Table not found')
  }
  return await TableModel.findByIdAndUpdate(mongoose.Types.ObjectId(id), { deletedAt: Date.now() })
}
const findTablesByAnyField = async (searchTerm) => {
  const isObjectId = mongoose.Types.ObjectId.isValid(searchTerm)

  const query = {
    $or: [
      ...(isObjectId ? [{ _id: new mongoose.Types.ObjectId(searchTerm) }] : []),
      { tableNumber: searchTerm },
      { restaurantID: isObjectId ? new mongoose.Types.ObjectId(searchTerm) : null }
    ]
  }

  return await TableModel.find(query).lean()
}

export const TableService = {
  getAllTable,
  getTableById,
  createTable,
  updateTable,
  deleteTable,
  findTablesByAnyField
}
