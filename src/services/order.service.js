import axios from 'axios'
import { TableModel } from '../models/tables.model.js'
import { CommonUtils } from '../utils/common.util.js'
import { NotFoundError } from '../errors/notFound.error.js'
import { OrderModel } from '../models/orders.model.js'
import mongoose, { Types } from 'mongoose'
import { BadRequestError } from '../errors/badRequest.error.js'
import { OrderDto } from '../dto/response/order.dto.js'

const getAllOrder = async () => {
  const orders = await OrderModel.aggregate([
    {
      $match: {
        deletedAt: null
      }
    },
    {
      $lookup: {
        from: 'tables',
        localField: 'tableId',
        foreignField: '_id',
        as: 'table'
      }
    },
    {
      $unwind: '$table'
    },
    {
      $lookup: {
        from: 'users',
        localField: 'userId',
        foreignField: '_id',
        as: 'user'
      }
    },
    {
      $unwind: '$user'
    },
    {
      $project: {
        _id: 1,
        tableId: 1,
        tableName: '$table.name',
        total: 1,
        status: 1,
        createdAt: 1,
        updatedAt: 1
      }
    }
  ])
  const list = []
  for (const order of orders) {
    list.push(OrderDto(order))
  }
  return list
}

const getOrderById = async (id) => {
  const orders = await OrderModel.aggregate([
    {
      $match: {
        _id: Types.ObjectId(id),
        deletedAt: null
      }
    },
    {
      $lookup: {
        from: 'tables',
        localField: 'tableId',
        foreignField: '_id',
        as: 'table'
      }
    },
    {
      $unwind: '$table'
    },
    {
      $lookup: {
        from: 'users',
        localField: 'userId',
        foreignField: '_id',
        as: 'user'
      }
    },
    {
      $unwind: '$user'
    },
    {
      $project: {
        _id: 1,
        tableId: 1,
        tableName: '$table.name',
        total: 1,
        status: 1,
        createdAt: 1,
        updatedAt: 1
      }
    }
  ])
  const list = []
  for (const order of orders) {
    list.push(OrderDto(order))
  }
  return list
}
const createOrder = async (id, { tableId, name, phoneNumber, payment, menu, status, checkin }) => {
  for (const tableIdItem of tableId) {
    const table = await TableModel.findById(tableIdItem, { deletedAt: null })
    if (!table) {
      throw new NotFoundError('Table not found')
    }
    if (table.status === false) {
      throw new BadRequestError('Table is not available')
    }
  }

  return await OrderModel.create({
    userId: id,
    tableId,
    name,
    phone_number: phoneNumber,
    payment,
    menu,
    status,
    checkin
  })
}

const updateOrder = async (id, { tableId, name, phoneNumber, payment, menu, status, checkin }) => {
  const order = await OrderModel.findById(id)
  if (!order) {
    throw new NotFoundError('Order not found')
  }
  for (const tableIdItem of tableId) {
    const table = await TableModel.findById(tableIdItem)
    if (!table) {
      throw new NotFoundError('Table not found')
    }
    if (table.status === false) {
      throw new BadRequestError('Table is not available')
    }
  }
  return await OrderModel.findByIdAndUpdate(mongoose.Types.ObjectId(id), {
    tableId,
    name,
    phone_number: phoneNumber,
    payment,
    menu,
    status,
    checkin,
    updatedAt: Date.now()
  })
}

const deleteOrder = async (id) => {
  const order = await OrderModel.findById(id)
  if (!order) {
    throw new NotFoundError('Order not found')
  }
  return await OrderModel.findByIdAndUpdate(mongoose.Types.ObjectId(id), { deletedAt: Date.now() })
}
export const OrderService = {
  getAllOrder,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder
}
