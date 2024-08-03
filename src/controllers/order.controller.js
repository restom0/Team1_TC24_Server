import { HttpStatusCode } from 'axios'
import { Response } from '../dto/response/response.js'
import { BadRequestError } from '../errors/badRequest.error.js'
import { OrderService } from '../services/order.service.js'
import { CommonUtils } from '../utils/common.util.js'

const getAllOrder = async (req, res, next) => {
  // #swagger.tags=['Order']
  try {
    const { page, size } = req.query
    const data = await OrderService.getAllOrder(page, size)
    next(new Response(200, 'Thành Công', data.data, data.info).resposeHandler(res))
  } catch (error) {
    next(new Response(error.statusCode || 500, error.message, null).resposeHandler(res))
  }
}

const getOrderById = async (req, res, next) => {
  // #swagger.tags=['Order']
  try {
    const data = await OrderService.getOrderById(req.params.id)
    next(new Response(HttpStatusCode.Ok, 'Thành Công', data).resposeHandler(res))
  } catch (error) {
    next(new Response(error.statusCode || 500, error.message, null).resposeHandler(res))
  }
}
const confirmOrder = async (req, res, next) => {
  // #swagger.tags=['Order']
  try {
    const data = await OrderService.confirmOrder(req.params.id)
    next(new Response(HttpStatusCode.Ok, 'Thành Công', data).resposeHandler(res))
  } catch (error) {
    next(new Response(error.statusCode || 500, error.message, null).resposeHandler(res))
  }
}

const payOrderDirect = async (req, res, next) => {
  // #swagger.tags=['Order']
  try {
    const paymentLinkRes = await OrderService.payOrderDirect(req.body)
    return res.json({
      error: 0,
      message: 'Thành Công',
      data: {
        bin: paymentLinkRes.bin,
        checkoutUrl: paymentLinkRes.checkoutUrl,
        accountNumber: paymentLinkRes.accountNumber,
        accountName: paymentLinkRes.accountName,
        amount: paymentLinkRes.amount,
        description: paymentLinkRes.description,
        orderCode: paymentLinkRes.orderCode,
        qrCode: paymentLinkRes.qrCode
      }
    })
  } catch (error) {
    next(new Response(-1, error.message, null).resposeHandler(res))
  }
}
const payOrder = async (req, res, next) => {
  // #swagger.tags=['Order']
  try {
    const paymentLinkRes = await OrderService.payOrder(req.body)
    return res.json({
      error: 0,
      message: 'Thành Công',
      data: {
        bin: paymentLinkRes.bin,
        checkoutUrl: paymentLinkRes.checkoutUrl,
        accountNumber: paymentLinkRes.accountNumber,
        accountName: paymentLinkRes.accountName,
        amount: paymentLinkRes.amount,
        description: paymentLinkRes.description,
        orderCode: paymentLinkRes.orderCode,
        qrCode: paymentLinkRes.qrCode
      }
    })
  } catch (error) {
    next(new Response(-1, error.message, null).resposeHandler(res))
  }
}
const createOrder = async (req, res, next) => {
  // #swagger.tags=['Order']
  try {
    if (CommonUtils.checkNullOrUndefined(req.body)) {
      throw new BadRequestError('Dữ liệu là bắt buộc')
    }
    const result = await OrderService.createOrder(req.user.id, req.body)
    next(new Response(HttpStatusCode.Created, 'Thành Công', result).resposeHandler(res))
  } catch (error) {
    next(new Response(error.statusCode || 500, error.message, null).resposeHandler(res))
  }
}
const createDirectOrder = async (req, res, next) => {
  // #swagger.tags=['Order']
  try {
    if (CommonUtils.checkNullOrUndefined(req.body)) {
      throw new BadRequestError('Dữ liệu là bắt buộc')
    }
    const result = await OrderService.createDirectOrder(req.user.id, req.body)
    next(new Response(HttpStatusCode.Created, 'Thành Công', result).resposeHandler(res))
  } catch (error) {
    next(new Response(error.statusCode || 500, error.message, null).resposeHandler(res))
  }
}
const updateOrder = async (req, res, next) => {
  // #swagger.tags=['Order']
  try {
    if (CommonUtils.checkNullOrUndefined(req.body)) {
      throw new BadRequestError('Dữ liệu là bắt buộc')
    }
    const result = await OrderService.updateOrder(req.params.id, req.body)
    next(new Response(200, 'Thành Công', result).resposeHandler(res))
  } catch (error) {
    next(new Response(error.statusCode || 500, error.message, null).resposeHandler(res))
  }
}
const confirmDirectOrder = async (req, res, next) => {
  // #swagger.tags=['Order']
  try {
    const data = await OrderService.confirmDirectOrder(req.params.id)
    next(new Response(HttpStatusCode.Ok, 'Thành Công', data).resposeHandler(res))
  } catch (error) {
    next(new Response(error.statusCode || 500, error.message, null).resposeHandler(res))
  }
}
const updateCheckin = async (req, res, next) => {
  // #swagger.tags=['Order']
  try {
    const data = await OrderService.updateCheckin(req.params.id)
    next(new Response(HttpStatusCode.Ok, 'Thành Công', data).resposeHandler(res))
  } catch (error) {
    next(new Response(error.statusCode || 500, error.message, null).resposeHandler(res))
  }
}
const updateCheckout = async (req, res, next) => {
  // #swagger.tags=['Order']
  try {
    const data = await OrderService.updateCheckout(req.params.id)
    next(new Response(HttpStatusCode.Ok, 'Thành Công', data).resposeHandler(res))
  } catch (error) {
    next(new Response(error.statusCode || 500, error.message, null).resposeHandler(res))
  }
}
const deleteOrder = async (req, res, next) => {
  // #swagger.tags=['Order']
  try {
    const result = await OrderService.deleteOrder(req.params.id)
    next(new Response(200, 'Thành Công', result).resposeHandler(res))
  } catch (error) {
    next(new Response(error.statusCode || 500, error.message, null).resposeHandler(res))
  }
}
const getSuccessfulOrders = async (req, res, next) => {
  try {
    const orders = await OrderService.findSuccessfulOrders()
    next(new Response(200, 'Thành Công', orders).resposeHandler(res))
  } catch (error) {
    next(new Response(error.statusCode || 500, error.message, null).resposeHandler(res))
  }
}
const getPendingCashOrders = async (req, res, next) => {
  try {
    const orders = await OrderService.findPendingCashOrders()
    next(new Response(200, 'Thành Công', orders).resposeHandler(res))
  } catch (error) {
    next(new Response(error.statusCode || 500, error.message, null).resposeHandler(res))
  }
}
const totalRevenueOrder = async (req, res, next) => {
  try {
    const result = await OrderService.totalRevenueOrder()
    next(new Response(200, 'Thành Công', result).resposeHandler(res))
  } catch (error) {
    next(new Response(error.statusCode || 500, error.message, null).resposeHandler(res))
  }
}
const countCompletedOrders = async (req, res, next) => {
  try {
    const result = await OrderService.countCompletedOrders()
    next(new Response(200, 'Thành Công', result).resposeHandler(res))
  } catch (error) {
    next(new Response(error.statusCode || 500, error.message, null).resposeHandler(res))
  }
}
const countOrder = async (req, res, next) => {
  try {
    const result = await OrderService.countOrder()
    next(new Response(200, 'Thành Công', result).resposeHandler(res))
  } catch (error) {
    next(new Response(error.statusCode || 500, error.message, null).resposeHandler(res))
  }
}

const countOrdersByStatus = async (req, res, next) => {
  try {
    const result = await OrderService.countOrdersByStatus()
    next(new Response(200, 'Thành Công', result).resposeHandler(res))
  } catch (error) {
    next(new Response(error.statusCode || 500, error.message, null).resposeHandler(res))
  }
}
const getMostFrequentRestaurantName = async (req, res, next) => {
  try {
    const result = await OrderService.getMostFrequentRestaurantName()
    next(new Response(200, 'Thành Công', result).resposeHandler(res))
  } catch (error) {
    next(new Response(error.statusCode || 500, error.message, null).resposeHandler(res))
  }
}

export const OrderController = {
  getAllOrder,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
  confirmOrder,
  payOrderDirect,
  payOrder,
  createDirectOrder,
  confirmDirectOrder,
  updateCheckin,
  updateCheckout,
  getSuccessfulOrders,
  getPendingCashOrders,
  totalRevenueOrder,
  countCompletedOrders,
  countOrder,
  countOrdersByStatus,
  getMostFrequentRestaurantName
}
