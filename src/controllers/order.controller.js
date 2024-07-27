import { HttpStatusCode } from 'axios'
import { Response } from '../dto/response/response.js'
import { BadRequestError } from '../errors/badRequest.error.js'
import { OrderService } from '../services/order.service.js'
import { CommonUtils } from '../utils/common.util.js'

const getAllOrder = async (req, res) => {
  // #swagger.tags=['Order']
  try {
    const data = await OrderService.getAllOrder()
    return new Response(200, 'Thành Công', data).resposeHandler(res)
  } catch (error) {
    return new Response(error.statusCode, error.message, null).resposeHandler(res)
  }
}

const getOrderById = async (req, res) => {
  // #swagger.tags=['Order']
  try {
    const data = await OrderService.getOrderById(req.params.id)
    return new Response(HttpStatusCode.Ok, 'Thành Công', data).resposeHandler(res)
  } catch (error) {
    return new Response(error.statusCode, error.message, null).resposeHandler(res)
  }
}
const confirmOrder = async (req, res) => {
  // #swagger.tags=['Order']
  try {
    const data = await OrderService.confirmOrder(req.params.id)
    return new Response(HttpStatusCode.Ok, 'Thành Công', data).resposeHandler(res)
  } catch (error) {
    return new Response(error.statusCode, error.message, null).resposeHandler(res)
  }
}

const payOrderDirect = async (req, res) => {
  // #swagger.tags=['Order']
}
const payOrder = async (req, res) => {
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
    console.log(error)
    return new Response(-1, error.message, null).resposeHandler(res)
  }
}
const createOrder = async (req, res) => {
  // #swagger.tags=['Order']
  try {
    if (CommonUtils.checkNullOrUndefined(req.body)) {
      throw new BadRequestError('Dữ liệu là bắt buộc')
    }
    const result = await OrderService.createOrder(req.user.id, req.body)
    return new Response(HttpStatusCode.Created, 'Thành Công', result).resposeHandler(res)
  } catch (error) {
    if (!res.headersSent) {
      return new Response(error.statusCode || 500, error.message, null).resposeHandler(res)
    }
  }
}
const createDirectOrder = async (req, res) => {
  // #swagger.tags=['Order']
  try {
    if (CommonUtils.checkNullOrUndefined(req.body)) {
      throw new BadRequestError('Dữ liệu là bắt buộc')
    }
    const result = await OrderService.createDirectOrder(req.user.id, req.body)
    return new Response(HttpStatusCode.Created, 'Thành Công', result).resposeHandler(res)
  } catch (error) {
    if (!res.headersSent) {
      return new Response(error.statusCode || 500, error.message, null).resposeHandler(res)
    }
  }
}
const updateOrder = async (req, res) => {
  // #swagger.tags=['Order']
  try {
    if (CommonUtils.checkNullOrUndefined(req.body)) {
      throw new BadRequestError('Dữ liệu là bắt buộc')
    }
    const result = await OrderService.updateOrder(req.params.id, req.body)
    return new Response(200, 'Thành Công', result).resposeHandler(res)
  } catch (error) {
    return new Response(error.statusCode || 500, error.message, null).resposeHandler(res)
  }
}
const confirmDirectOrder = async (req, res) => {
  // #swagger.tags=['Order']
  try {
    const data = await OrderService.confirmDirectOrder(req.params.id)
    return new Response(HttpStatusCode.Ok, 'Thành Công', data).resposeHandler(res)
  } catch (error) {
    return new Response(error.statusCode, error.message, null).resposeHandler(res)
  }
}
const updateCheckin = async (req, res) => {
  // #swagger.tags=['Order']
  try {
    const data = await OrderService.updateCheckin(req.params.id)
    return new Response(HttpStatusCode.Ok, 'Thành Công', data).resposeHandler(res)
  } catch (error) {
    return new Response(error.statusCode, error.message, null).resposeHandler(res)
  }
}
const updateCheckout = async (req, res) => {
  // #swagger.tags=['Order']
  try {
    const data = await OrderService.updateCheckout(req.params.id)
    return new Response(HttpStatusCode.Ok, 'Thành Công', data).resposeHandler(res)
  } catch (error) {
    return new Response(error.statusCode, error.message, null).resposeHandler(res)
  }
}
const deleteOrder = async (req, res) => {
  // #swagger.tags=['Order']
  try {
    const result = await OrderService.deleteOrder(req.params.id)
    return new Response(200, 'Thành Công', result).resposeHandler(res)
  } catch (error) {
    return new Response(error.statusCode, error.message, null).resposeHandler(res)
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
  updateCheckout
}
