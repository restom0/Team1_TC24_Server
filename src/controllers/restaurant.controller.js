import { HttpStatusCode } from 'axios'
import { Response } from '../dto/response/response.js'
import { BadRequestError } from '../errors/badRequest.error.js'
import { NotFoundError } from '../errors/notFound.error.js'
import { RestaurantService } from '../services/restaurant.service.js'
import { CommonUtils } from '../utils/common.util.js'

const getAllRestaurant = async (req, res) => {
  // #swagger.tags=['Restaurant']
  try {
    const data = await RestaurantService.getAllRestaurant()
    return new Response(200, 'Thành Công', data).resposeHandler(res)
  } catch (error) {
    return new Response(500, error.message, null).resposeHandler(res)
  }
}

const getRestaurantById = async (req, res, next) => {
  // #swagger.tags=['Restaurant']
  try {
    const data = await RestaurantService.getRestaurantById(req.params.id)
    return new Response(200, 'Thành Công', data).resposeHandler(res)
  } catch (error) {
    if (!res.headersSent) {
      return new Response(error.statusCode || 500, error.message, null).resposeHandler(res)
    }
    next(error)
  }
}

const createRestaurant = async (req, res) => {
  // #swagger.tags=['Restaurant']
  try {
    if (CommonUtils.checkNullOrUndefined(req.body)) {
      throw new BadRequestError('Dữ liệu là bắt buộc')
    }
    const result = await RestaurantService.createRestaurant(req.user.id, req.body)
    return new Response(201, 'Thành Công', result).resposeHandler(res)
  } catch (error) {
    return new Response(500, error.message, null).resposeHandler(res)
  }
}

const updateRestaurant = async (req, res) => {
  // #swagger.tags=['Restaurant']
  try {
    if (CommonUtils.checkNullOrUndefined(req.body)) {
      throw new BadRequestError('Dữ liệu là bắt buộc')
    }
    const result = await RestaurantService.updateRestaurant(req.params.id, req.body)
    return new Response(200, 'Thành Công', result).resposeHandler(res)
  } catch (error) {
    return new Response(error.statusCode || 500, error.message, null).resposeHandler(res)
  }
}

const deleteRestaurant = async (req, res) => {
  // #swagger.tags=['Restaurant']
  try {
    const result = await RestaurantService.deleteRestaurant(req.params.id)
    return new Response(HttpStatusCode.Accepted, 'Thành Công', result).resposeHandler(res)
  } catch (error) {
    return new Response(error.statusCode || 500, error.message, null).resposeHandler(res)
  }
}

const getFourNearestRestaurant = async (req, res) => {
  // #swagger.tags=['Restaurant']
  try {
    const data = await RestaurantService.getFourNearestRestaurant(req.query)
    return new Response(200, 'Thành Công', data).resposeHandler(res)
  } catch (error) {
    return new Response(error.statusCode || 500, error.message, null).resposeHandler(res)
  }
}

const getDistanceFromRestaurant = async (req, res) => {
  // #swagger.tags=['Restaurant']
  try {
    const data = await RestaurantService.getDistanceFromRestaurant(req.query)
    return new Response(200, 'Thành Công', data).resposeHandler(res)
  } catch (error) {
    return new Response(error.statusCode || 500, error.message, null).resposeHandler(res)
  }
}

const findRestaurantByAnyField = async (req, res, next) => {
  try {
    const { searchTerm } = req.body
    if (!searchTerm) {
      throw new BadRequestError('Giá trị tìm kiếm là bắt buộc')
    }
    const result = await RestaurantService.findRestaurantsByAnyField(searchTerm)
    if (result.length === 0) {
      return new Response(404, 'Không tìm thấy nhà hàng', null).resposeHandler(res)
    }
    return new Response(200, 'Đã tìm thấy nhà hàng', result).resposeHandler(res)
  } catch (error) {
    return new Response(error.statusCode || 500, error.message, null).resposeHandler(res)
  }
}

const countRestaurant = async (req, res, next) => {
  try {
    const result = await RestaurantService.countRestaurant()
    return new Response(200, 'Thành Công', result).resposeHandler(res)
  } catch (error) {
    if (!res.headersSent) {
      return new Response(error.statusCode || 500, error.message, null).resposeHandler(res)
    }
    next(error)
  }
}
export const RestaurantController = {
  getAllRestaurant,
  getRestaurantById,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
  getFourNearestRestaurant,
  findRestaurantByAnyField,
  countRestaurant
}
