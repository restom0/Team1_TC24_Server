import axios from 'axios'
import { CommonUtils } from '../utils/common.util.js'
import { NotFoundError } from '../errors/notFound.error.js'
import { TableModel } from '../models/tables.model.js'
import mongoose, { Types } from 'mongoose'
import { RestaurantModel } from '../models/restaurants.model.js'
import { BadRequestError } from '../errors/badRequest.error.js'
const getAllTable = async () => {
  return await TableModel.aggregate([
    {
      $match: {
        deletedAt: { $eq: null }
      }
    },
    {
      $lookup: {
        from: 'restaurants',
        localField: 'restaurantID',
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
        restaurant: '$restaurant',
        name: 1,
        status: 1,
        createdAt: 1,
        updatedAt: 1,
        tableNumber: 1,
        peopleAmount: 1,
        price: 1
      }
    }
  ])
}

const getTableById = async (id) => {
  return await TableModel.aggregate([
    {
      $match: {
        _id: Types.ObjectId.createFromHexString(id),
        deletedAt: null
      }
    },
    {
      $lookup: {
        from: 'restaurants',
        localField: 'restaurantID',
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
        peopleAmount: 1,
        tableNumber: 1,
        price: 1,
        restaurantID: 1,
        restaurant: '$restaurant'
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
const createTable = async ({ tableNumber, peopleAmount, price, restaurantID }) => {
  const restaurant = await RestaurantModel.find({
    _id: Types.ObjectId.createFromHexString(restaurantID),
    deletedAt: null
  })
  if (restaurant.length === 0) {
    throw new NotFoundError('Nhà hàng không tìm thấy')
  }
  const check = await TableModel.find({
    peopleAmount,
    restaurantID: Types.ObjectId.createFromHexString(restaurantID)
  })
  if (check.length > 0) {
    throw new BadRequestError('Đã tồn tại')
  }
  const newTable = new TableModel({
    _id: new mongoose.Types.ObjectId(),
    tableNumber,
    peopleAmount,
    price,
    restaurantID: Types.ObjectId.createFromHexString(restaurantID),
    createdAt: new Date(),
    updatedAt: new Date()
  })
  return await newTable.save()
}

// const updateTable = async (id, { tableNumber }) => {
//   return (
//     await TableModel.findByIdAndUpdate(Types.ObjectId.createFromHexString(id)),
//     {
//       tableNumber,
//       updatedAt: Date.now()
//     }
//   )
// }
const updateTable = async (id, { tableNumber, peopleAmount, price }) => {
  return await TableModel.findByIdAndUpdate(
    Types.ObjectId.createFromHexString(id),
    {
      $set: {
        tableNumber,
        peopleAmount,
        price,
        updatedAt: new Date()
      }
    },
    { new: true }
  )
}
const deleteTable = async (id) => {
  const table = await TableModel.find({ _id: id, deletedAt: { $eq: null } })

  if (table.length === 0) {
    throw new NotFoundError('Table not found')
  }
  return await TableModel.findByIdAndUpdate(Types.ObjectId.createFromHexString(id), { deletedAt: Date.now() })
}
const findTablesByAnyField = async (searchTerm) => {
  const isObjectId = mongoose.Types.ObjectId.isValid(searchTerm)

  const query = {
    $or: [
      ...(isObjectId
        ? [{ _id: Types.ObjectId.isValid(searchTerm) ? null : Types.ObjectId.createFromHexString(searchTerm) }]
        : []),
      { tableNumber: isNaN(searchTerm) ? null : searchTerm },
      { peopleAmount: isNaN(searchTerm) ? null : searchTerm },
      { price: isNaN(searchTerm) ? null : searchTerm },
      { restaurantID: Types.ObjectId.isValid(searchTerm) ? null : Types.ObjectId.createFromHexString(searchTerm) }
    ]
  }

  return await TableModel.find(query).lean()
}
const getAllTableByFilterAndSort = async (upper, lower, sort, page) => {
  if (sort === 'new') {
    return await TableModel.aggregate([
      {
        $match: {
          deletedAt: { $eq: null },
          $expr: {
            $and: [
              { $gte: [{ $divide: ['$price', '$peopleAmount'] }, Number(lower)] },
              { $lte: [{ $divide: ['$price', '$peopleAmount'] }, Number(upper)] }
            ]
          }
        }
      },
      {
        $lookup: {
          from: 'restaurants',
          localField: 'restaurantID',
          foreignField: '_id',
          as: 'restaurant'
        }
      },
      {
        $unwind: '$restaurant'
      },
      {
        $group: {
          _id: '$restaurantID',
          restaurant: { $first: '$restaurant' },
          name: { $first: '$name' },
          status: { $first: '$status' },
          createdAt: { $first: '$createdAt' },
          updatedAt: { $first: '$updatedAt' },
          tableNumber: { $first: '$tableNumber' },
          peopleAmount: { $first: '$peopleAmount' },
          price: { $first: '$price' }
        }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $project: {
          _id: 0,
          restaurantId: '$_id', // Renaming _id to restaurantId
          restaurant: 1,
          name: 1,
          status: 1,
          createdAt: 1,
          updatedAt: 1,
          tableNumber: 1,
          peopleAmount: 1,
          price: 1
        }
      },
      {
        $skip: (page - 1) * 8
      },
      {
        $limit: 8
      }
    ])
  } else if (sort === 'old') {
    return await TableModel.aggregate([
      {
        $match: {
          deletedAt: { $eq: null },
          $expr: {
            $and: [
              { $gte: [{ $divide: ['$price', '$peopleAmount'] }, Number(lower)] },
              { $lte: [{ $divide: ['$price', '$peopleAmount'] }, Number(upper)] }
            ]
          }
        }
      },
      {
        $lookup: {
          from: 'restaurants',
          localField: 'restaurantID',
          foreignField: '_id',
          as: 'restaurant'
        }
      },
      {
        $unwind: '$restaurant'
      },
      {
        $group: {
          _id: '$restaurantID',
          restaurant: { $first: '$restaurant' },
          name: { $first: '$name' },
          status: { $first: '$status' },
          createdAt: { $first: '$createdAt' },
          updatedAt: { $first: '$updatedAt' },
          tableNumber: { $first: '$tableNumber' },
          peopleAmount: { $first: '$peopleAmount' },
          price: { $first: '$price' }
        }
      },
      {
        $sort: { createdAt: 1 }
      },
      {
        $project: {
          _id: 0,
          restaurantId: '$_id',
          restaurant: 1,
          name: 1,
          status: 1,
          createdAt: 1,
          updatedAt: 1,
          tableNumber: 1,
          peopleAmount: 1,
          price: 1
        }
      },
      {
        $skip: (page - 1) * 8
      },
      {
        $limit: 8
      }
    ])
  } else if (sort === 'A->Z') {
    return await TableModel.aggregate([
      {
        $match: {
          deletedAt: { $eq: null },
          $expr: {
            $and: [
              { $gte: [{ $divide: ['$price', '$peopleAmount'] }, Number(lower)] },
              { $lte: [{ $divide: ['$price', '$peopleAmount'] }, Number(upper)] }
            ]
          }
        }
      },
      {
        $lookup: {
          from: 'restaurants',
          localField: 'restaurantID',
          foreignField: '_id',
          as: 'restaurant'
        }
      },
      {
        $unwind: '$restaurant'
      },
      {
        $group: {
          _id: '$restaurantID',
          restaurant: { $first: '$restaurant' },
          name: { $first: '$name' },
          status: { $first: '$status' },
          createdAt: { $first: '$createdAt' },
          updatedAt: { $first: '$updatedAt' },
          tableNumber: { $first: '$tableNumber' },
          peopleAmount: { $first: '$peopleAmount' },
          price: { $first: '$price' }
        }
      },
      {
        $sort: { 'restaurant.name': 1 }
      },
      {
        $project: {
          _id: 0,
          restaurantId: '$_id',
          restaurant: 1,
          name: 1,
          status: 1,
          createdAt: 1,
          updatedAt: 1,
          tableNumber: 1,
          peopleAmount: 1,
          price: 1
        }
      },
      {
        $skip: (page - 1) * 8
      },
      {
        $limit: 8
      }
    ])
  } else if (sort === 'Z->A') {
    return await TableModel.aggregate([
      {
        $match: {
          deletedAt: { $eq: null },
          $expr: {
            $and: [
              { $gte: [{ $divide: ['$price', '$peopleAmount'] }, Number(lower)] },
              { $lte: [{ $divide: ['$price', '$peopleAmount'] }, Number(upper)] }
            ]
          }
        }
      },
      {
        $lookup: {
          from: 'restaurants',
          localField: 'restaurantID',
          foreignField: '_id',
          as: 'restaurant'
        }
      },
      {
        $unwind: '$restaurant'
      },
      {
        $group: {
          _id: '$restaurantID',
          restaurant: { $first: '$restaurant' },
          name: { $first: '$name' },
          status: { $first: '$status' },
          createdAt: { $first: '$createdAt' },
          updatedAt: { $first: '$updatedAt' },
          tableNumber: { $first: '$tableNumber' },
          peopleAmount: { $first: '$peopleAmount' },
          price: { $first: '$price' }
        }
      },
      {
        $sort: { 'restaurant.name': -1 }
      },
      {
        $project: {
          _id: 0,
          restaurantId: '$_id',
          restaurant: 1,
          name: 1,
          status: 1,
          createdAt: 1,
          updatedAt: 1,
          tableNumber: 1,
          peopleAmount: 1,
          price: 1
        }
      },
      {
        $skip: (page - 1) * 8
      },
      {
        $limit: 8
      }
    ])
  } else if (sort === 'price-asc') {
    return await TableModel.aggregate([
      {
        $match: {
          deletedAt: { $eq: null },
          $expr: {
            $and: [
              { $gte: [{ $divide: ['$price', '$peopleAmount'] }, Number(lower)] },
              { $lte: [{ $divide: ['$price', '$peopleAmount'] }, Number(upper)] }
            ]
          }
        }
      },
      {
        $lookup: {
          from: 'restaurants',
          localField: 'restaurantID',
          foreignField: '_id',
          as: 'restaurant'
        }
      },
      {
        $unwind: '$restaurant'
      },
      {
        $addFields: {
          pricePerPerson: { $divide: ['$price', '$peopleAmount'] }
        }
      },
      {
        $group: {
          _id: '$restaurantID',
          restaurant: { $first: '$restaurant' },
          name: { $first: '$name' },
          status: { $first: '$status' },
          createdAt: { $first: '$createdAt' },
          updatedAt: { $first: '$updatedAt' },
          tableNumber: { $first: '$tableNumber' },
          peopleAmount: { $first: '$peopleAmount' },
          price: { $first: '$price' },
          pricePerPerson: { $first: '$pricePerPerson' }
        }
      },
      {
        $sort: { pricePerPerson: 1 }
      },
      {
        $project: {
          _id: 0,
          restaurantId: '$_id',
          restaurant: 1,
          name: 1,
          status: 1,
          createdAt: 1,
          updatedAt: 1,
          tableNumber: 1,
          peopleAmount: 1,
          price: 1
        }
      },
      {
        $skip: (page - 1) * 8
      },
      {
        $limit: 8
      }
    ])
  } else if (sort === 'price-desc') {
    return await TableModel.aggregate([
      {
        $match: {
          deletedAt: { $eq: null },
          $expr: {
            $and: [
              { $gte: [{ $divide: ['$price', '$peopleAmount'] }, Number(lower)] },
              { $lte: [{ $divide: ['$price', '$peopleAmount'] }, Number(upper)] }
            ]
          }
        }
      },
      {
        $lookup: {
          from: 'restaurants',
          localField: 'restaurantID',
          foreignField: '_id',
          as: 'restaurant'
        }
      },
      {
        $unwind: '$restaurant'
      },
      {
        $addFields: {
          pricePerPerson: { $divide: ['$price', '$peopleAmount'] }
        }
      },
      {
        $group: {
          _id: '$restaurantID',
          restaurant: { $first: '$restaurant' },
          name: { $first: '$name' },
          status: { $first: '$status' },
          createdAt: { $first: '$createdAt' },
          updatedAt: { $first: '$updatedAt' },
          tableNumber: { $first: '$tableNumber' },
          peopleAmount: { $first: '$peopleAmount' },
          price: { $first: '$price' },
          pricePerPerson: { $first: '$pricePerPerson' }
        }
      },
      {
        $sort: { pricePerPerson: -1 }
      },
      {
        $project: {
          _id: 0,
          restaurantId: '$_id',
          restaurant: 1,
          name: 1,
          status: 1,
          createdAt: 1,
          updatedAt: 1,
          tableNumber: 1,
          peopleAmount: 1,
          price: 1
        }
      },
      {
        $skip: (page - 1) * 8
      },
      {
        $limit: 8
      }
    ])
  }
}

export const TableService = {
  getAllTable,
  getTableById,
  createTable,
  updateTable,
  deleteTable,
  findTablesByAnyField,
  getAllTableByFilterAndSort
}
