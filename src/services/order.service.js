/* eslint-disable camelcase */
import axios from 'axios'
import { TableModel } from '../models/tables.model.js'
import { CommonUtils } from '../utils/common.util.js'
import { NotFoundError } from '../errors/notFound.error.js'
import { OrderModel } from '../models/orders.model.js'
import mongoose, { Types } from 'mongoose'
import { BadRequestError } from '../errors/badRequest.error.js'
import { payOS } from '../configs/payos.config.js'
import { PAYMENT_METHOD } from '../constants/payment_method.constant.js'
import { PAYMENT_STATUS } from '../constants/payment_status.constant.js'
import { RestaurantModel } from '../models/restaurants.model.js'
import { MailService } from './mail.service.js'

const getAllOrder = async (page, size) => {
  const orders = await OrderModel.aggregate([
    {
      $lookup: {
        from: 'users',
        localField: 'user_id',
        foreignField: '_id',
        as: 'user'
      }
    },
    {
      $unwind: '$user'
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
        user: '$user',
        restaurant: '$restaurant',
        total_people: 1,
        name: 1,
        phone_number: 1,
        payment: 1,
        menu_list: 1,
        status: 1,
        checkin: 1,
        orderCode: 1,
        total: 1,
        checkout: 1,
        email: 1
      }
    }
  ])
  const list = []
  for (const order of orders) {
    list.push(order)
  }
  return {
    data: list,
    info: {
      total: await OrderModel.countDocuments(),
      page,
      size,
      number_of_pages: Math.ceil((await OrderModel.countDocuments()) / size)
    }
  }
}

const getOrderById = async (id) => {
  const orders = await OrderModel.aggregate([
    {
      $match: {
        _id: Types.ObjectId.createFromHexString(id),
        deleted_at: null
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: 'user_id',
        foreignField: '_id',
        as: 'user'
      }
    },
    {
      $unwind: '$user'
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
        user: '$user',
        restaurant: '$restaurant',
        total_people: 1,
        name: 1,
        phone_number: 1,
        payment: 1,
        menu_list: 1,
        status: 1,
        checkin: 1,
        orderCode: 1,
        total: 1,
        checkout: 1,
        email: 1
      }
    }
  ])
  const list = []
  for (const order of orders) {
    list.push(order)
  }
  return list
}
const createOrder = async (
  id,
  { total_people, email, name, phone_number, payment, menu_list, checkin, restaurant_id, total }
) => {
  const order = await OrderModel.create({
    _id: new mongoose.Types.ObjectId(),
    user_id: id,
    total_people,
    name,
    phone_number,
    payment,
    menu_list,
    status: 'PENDING',
    checkin,
    orderCode: Number(String(new Date().getTime()).slice(-6)),
    restaurant_id,
    total: Number(total).toFixed(0),
    email
  })
  if (payment === 'CREDIT_CARD') {
    const paymentLinkRes = await payOrder({ orderCode: order.orderCode, total })
    return { order, paymentLinkRes }
  }
  return order
}
const createDirectOrder = async (
  id,
  { total_people, email, name, phone_number, payment, menu_list, checkin, restaurant_id, total }
) => {
  const order = await OrderModel.create({
    _id: new mongoose.Types.ObjectId(),
    user_id: id,
    total_people,
    name,
    phone_number,
    payment,
    menu_list,
    status: 'PENDING',
    checkin,
    orderCode: Number(String(new Date().getTime()).slice(-6)),
    restaurant_id,
    total: Number(total).toFixed(0),
    email
  })
  if (payment === 'CREDIT_CARD') {
    const paymentLinkRes = await payDirectOrder({ orderCode: order.orderCode, total })
    return { order, paymentLinkRes }
  }
  return order
}
const updateOrder = async (id, { menu_list, total }) => {
  const order = await OrderModel.findById(id).orFail(new NotFoundError('Order not found'))
  return await OrderModel.findByIdAndUpdate(mongoose.Types.ObjectId(id), {
    menu_list,
    total,
    updated_at: Date.now()
  })
}

const confirmOrder = async (id) => {
  const order = await OrderModel.findOne({ orderCode: id })
  if (!order) {
    throw new NotFoundError('Order not found')
  }
  const status = await axios.get(`https://api-merchant.payos.vn/v2/payment-requests/${id}`, {
    headers: {
      'Content-Type': 'application/json',
      'x-client-id': process.env.PAYOS_CLIENT_ID,
      'x-api-key': process.env.PAYOS_API_KEY
    }
  })
  if (status.data.data.status === 'CANCELLED') {
    return await OrderModel.findOneAndUpdate({ orderCode: order.orderCode }, { status: 'CANCELLED' })
  }
  if (status.data.data.status === 'PAID') {
    const result = await OrderModel.aggregate([
      {
        $match: { orderCode: Number(id) }
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
        $lookup: {
          from: 'users',
          localField: 'user_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: '$user'
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
        $project: {
          _id: 1,
          user: '$user',
          restaurant: '$restaurant',
          total_people: 1,
          name: 1,
          phone_number: 1,
          payment: 1,
          menu_list: 1,
          status: 1,
          checkin: 1,
          orderCode: 1,
          total: 1,
          checkout: 1,
          email: 1
        }
      }
    ])
    const subject = 'Xác nhận đơn hàng'
    const html =
      `<p>Đơn hàng của bạn đã được xác nhận</p>
                  <p>Mã đơn hàng: ${result[0].orderCode}</p>
                  <p>Ngày nhận bàn: ${Date(result[0].checkin).slice(0, 11)}</p>
                  <p>Thời gian nhận bàn: ${Date(result[0].checkin).slice(11, 16)}</p>
                  <p>Địa chỉ nhà hàng: ${result[0].restaurant.address}</p>
                  <p>Địa chỉ email: ${result[0].email}</p>
                  <p>Số điện thoại: ${result[0].phone_number}</p>
                  <p>Người nhận bàn: ${result[0].name}</p>
                  <p>Số người: ${result[0].total_people}</p>
                  <p>Phương thức thanh toán: ${result[0].payment}</p>
                  <p>Menu: 
                  ` +
      result[0].menuList
        .map((item) => `<p>${item.name} - ${Number(item.price).toFixed(0)} đ - ${item.quantity} - ${item.unit} </p>`)
        .join('') +
      `
                  </p>
                  <p>Tổng tiền: ${Number(result[0].total).toFixed(0).toLocaleString('vi-VN')} đ</p>
                  `
    MailService.sendMail({ to: result[0].email, subject, html })
    return await OrderModel.findOneAndUpdate({ orderCode: order.orderCode }, { status: 'SUCCESS' })
  }
}
const confirmDirectOrder = async (id) => {
  const order = await OrderModel.findById(id).orFail(new NotFoundError('Order not found'))
  order.status = PAYMENT_STATUS.ONHOLD
  return await OrderModel.findByIdAndUpdate(id, {
    status: 'SUCCESS'
  })
}
const payDirectOrder = async (total) => {
  // https://api.vietqr.io/v2/generate
  const body = {
    accountNo: process.env.BANK_ACCOUNT,
    accountName: 'THÁI NGỌC RẠNG',
    acqId: 970416,
    amount: Math.ceil(Number(total)),
    addInfo: 'Thanh toán đơn hàng',
    format: 'text',
    template: 'print'
  }
  const response = await axios
    .post('https://api.vietqr.io/v2/generate', body, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(() => {
      if (response?.code === '00') {
        return {
          qr_url: response?.qrDataURL
        }
      } else {
        throw new BadRequestError(response.desc)
      }
    })
}
const updateCheckout = async (id) => {
  const order = await OrderModel.find({ _id: id, status: PAYMENT_STATUS.ONHOLD })
  if (order.length === 0) {
    throw new NotFoundError('Order not found')
  }
  return await OrderModel.findByIdAndUpdate(id, {
    status: PAYMENT_STATUS.COMPLETED,
    checkout: new Date()
  })
}
const updateCheckin = async (id) => {
  const order = await OrderModel.find({
    $or: [
      { _id: id, status: PAYMENT_STATUS.SUCCESS },
      { _id: id, status: PAYMENT_STATUS.PENDING, payment: PAYMENT_METHOD.CASH }
    ]
  }).orFail(new NotFoundError('Order not found'))
  return await OrderModel.findByIdAndUpdate(id, {
    status: PAYMENT_STATUS.ONHOLD
  })
}
const payOrder = async ({ orderCode, total }) => {
  const YOUR_DOMAIN = 'http://localhost:5173'
  const body = {
    orderCode,
    amount: Math.ceil(Number(total)),
    description: 'Thanh toán đơn hàng',
    returnUrl: `${YOUR_DOMAIN}/checkout?step=1`,
    cancelUrl: `${YOUR_DOMAIN}/checkout?step=1`
  }
  return await payOS.createPaymentLink(body)
}
const deleteOrder = async (id) => {
  const order = await OrderModel.findById(id).orFail(new NotFoundError('Order not found'))
  return await OrderModel.findByIdAndUpdate(mongoose.Types.ObjectId(id), { deleted_at: Date.now() })
}
const findSuccessfulOrders = async () => {
  return await OrderModel.aggregate([
    {
      $match: { status: 'ONHOLD' }
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
        localField: 'user_id',
        foreignField: '_id',
        as: 'user'
      }
    },
    {
      $unwind: '$user'
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
        table: '$table',
        user: '$user',
        restaurant: '$restaurant',
        totalPeople: 1,
        name: 1,
        phone_number: 1,
        payment: 1,
        menuList: 1,
        status: 1,
        checkin: 1,
        orderCode: 1,
        total: 1
      }
    }
  ])
}

const findPendingCashOrders = async () => {
  const query = {
    payment: PAYMENT_METHOD.CASH,
    status: PAYMENT_STATUS.PENDING
  }
  const orders = await OrderModel.aggregate([
    {
      $match: query
    },
    {
      $unwind: '$table'
    },
    {
      $lookup: {
        from: 'users',
        localField: 'user_id',
        foreignField: '_id',
        as: 'user'
      }
    },
    {
      $unwind: '$user'
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
        table: '$table',
        user: '$user',
        restaurant: '$restaurant',
        totalPeople: 1,
        name: 1,
        phone_number: 1,
        payment: 1,
        menuList: 1,
        status: 1,
        checkin: 1,
        orderCode: 1,
        total: 1
      }
    }
  ])
  return orders
}
const totalRevenueOrder = async () => {
  const result = await OrderModel.aggregate([
    {
      $match: { status: 'COMPLETED' }
    },
    {
      $group: {
        _id: null,
        totalPrice: { $sum: '$total' }
      }
    }
  ])
  if (result.length > 0) {
    return result[0].totalPrice
  } else {
    return 0
  }
}
const countCompletedOrders = async () => {
  return await OrderModel.countDocuments({ status: 'COMPLETED' })
}
const countOrder = async () => {
  return await OrderModel.countDocuments({ deleted_at: null })
}
const countOrdersByStatus = async () => {
  return await OrderModel.countDocuments({ status: 'ONHOLD' })
}

const getMostFrequentRestaurantName = async () => {
  const result = await OrderModel.aggregate([
    {
      $group: {
        _id: '$restaurant_id',
        count: { $sum: 1 }
      }
    },
    {
      $sort: { count: -1 }
    },
    {
      $limit: 1
    }
  ])

  if (result.length > 0) {
    const mostFrequentRestaurant = result[0]

    const restaurant = await RestaurantModel.findById(mostFrequentRestaurant._id).select('name')

    return restaurant ? restaurant.name : null
  } else {
    return null
  }
}

export const OrderService = {
  getAllOrder,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
  confirmOrder,
  payOrder,
  createDirectOrder,
  confirmDirectOrder,
  updateCheckin,
  updateCheckout,
  findSuccessfulOrders,
  findPendingCashOrders,
  totalRevenueOrder,
  countCompletedOrders,
  countOrder,
  countOrdersByStatus,
  getMostFrequentRestaurantName
}
