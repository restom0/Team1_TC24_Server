import axios from 'axios'
import { TableModel } from '../models/tables.model.js'
import { CommonUtils } from '../utils/common.util.js'
import { NotFoundError } from '../errors/notFound.error.js'
import { OrderModel } from '../models/orders.model.js'
import mongoose, { Types } from 'mongoose'
import { BadRequestError } from '../errors/badRequest.error.js'
import { OrderDto } from '../dto/response/order.dto.js'
import { payOS } from '../configs/payos.config.js'

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
const createOrder = async (id, { tableNumber, name, phoneNumber, payment, menu, checkin }) => {
  const order = await OrderModel.create({
    userId: id,
    tableNumber,
    name,
    phone_number: phoneNumber,
    payment,
    orderCode: Number(String(new Date().getTime()).slice(-6)),
    menu,
    status: 'PENDING',
    checkin
  })
  if (payment === 'CREDIT_CARD') {
    const paymentLinkRes = await payOrder({ orderCode: order.orderCode, total: order.total })
    return { order, paymentLinkRes }
  }
  return order
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

const confirmOrder = async (id) => {
  const order = await OrderModel.findOne({ orderCode: id })
  if (!order) {
    throw new NotFoundError('Order not found')
  }
  const status = await axios.get(`https://api-merchant.payos.vn/v2/payment-requests/199645/${id}`, {
    headers: {
      'Content-Type': 'application/json',
      'x-client-id': process.env.PAYOS_CLIENT_ID,
      'x-api-key': process.env.PAYOS_API_KEY
    }
  })
  if (status.data.status === 'CANCELLED') {
    return await OrderModel.findByIdAndUpdate(order.orderCode, { status: 'CANCELLED' })
  }
  if (status.data.status === 'SUCCESS') {
    return await OrderModel.findByIdAndUpdate(order.orderCode, { status: 'SUCCESS' })
  }
}
const payDirectOrder = async (req, res) => {}
const payOrder = async ({ orderCode, total }) => {
  const YOUR_DOMAIN = 'http://localhost:5173'
  const body = {
    orderCode,
    amount: total,
    description: 'Thanh toán đơn hàng',
    returnUrl: `${YOUR_DOMAIN}/checkout?step=3`,
    cancelUrl: `${YOUR_DOMAIN}/checkout?step=3`
  }
  return await payOS.createPaymentLink(body)
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
  deleteOrder,
  confirmOrder,
  payOrder
}
