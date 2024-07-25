import { HttpStatusCode } from 'axios'
import { Response } from '../dto/response/response.js'
import { BadRequestError } from '../errors/badRequest.error.js'
import { OrderService } from '../services/order.service.js'
import { CommonUtils } from '../utils/common.util.js'

const getAllOrder = async (req, res) => {
  try {
    const data = await OrderService.getAllOrder()
    Response(200, 'success', data).resposeHandler(res)
  } catch (error) {
    Response(error.statusCode, error.message, null).resposeHandler(res)
  }
}

const getOrderById = async (req, res) => {
  try {
    const data = await OrderService.getOrderById(req.params.id)
    Response(HttpStatusCode.Ok, 'success', data).resposeHandler(res)
  } catch (error) {
    Response(error.statusCode, error.message, null).resposeHandler(res)
  }
}

const createOrder = async (req, res) => {
  try {
    if (CommonUtils.checkNullOrUndefined(req.body)) {
      throw new BadRequestError('Data is required')
    }
    const result = await OrderService.createOrder(req.user.id, ...req.body)
    Response(HttpStatusCode.Created, 'success', result).resposeHandler(res)
  } catch (error) {
    Response(error.statusCode, error.message, null).resposeHandler(res)
  }
}

const updateOrder = async (req, res) => {
  try {
    if (CommonUtils.checkNullOrUndefined(req.body)) {
      throw new BadRequestError('Data is required')
    }
    const result = await OrderService.updateOrder(req.params.id, ...req.body)
    new Response(200, 'success', result).resposeHandler(res)
  } catch (error) {
    Response(error.statusCode, error.message, null).resposeHandler(res)
  }
}

const deleteOrder = async (req, res) => {
  try {
    const result = await OrderService.deleteOrder(req.params.id)
    Response(200, 'success', result).resposeHandler(res)
  } catch (error) {
    Response(error.statusCode, error.message, null).resposeHandler(res)
  }
}

export const OrderController = {
  getAllOrder,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder
}
