import { HttpStatusCode } from 'axios'
import { Response } from '../dto/response/response.js'
import { BadRequestError } from '../errors/badRequest.error.js'
import { NotFoundError } from '../errors/notFound.error.js'
import { RestaurantService } from '../services/restaurant.service.js'
import { CommonUtils } from '../utils/common.util.js'

const getAllRestaurant = async (req, res, next) => {
  // #swagger.tags=['Restaurant']
  try {
    let data
    const { upper, lower, sort, page, size, field } = req.query
    if (size) {
      const { upper, lower, sort, page } = req.query
      data = await RestaurantService.getAllTableByFilterAndSort(upper, lower, sort, page)
    } else {
      data = await RestaurantService.getAllRestaurant(page, size, field, sort)
    }
    next(new Response(200, 'Thành Công', data.data, data.info).resposeHandler(res))
  } catch (error) {
    next(new Response(error.statusCode || 500, error.message, null).resposeHandler(res))
  }
}

const getRestaurantById = async (req, res, next) => {
  // #swagger.tags=['Restaurant']
  try {
    const data = await RestaurantService.getRestaurantById(req.params.id)
    next(new Response(200, 'Thành Công', data).resposeHandler(res))
  } catch (error) {
    next(new Response(error.statusCode || 500, error.message, null).resposeHandler(res))
  }
}

const createRestaurant = async (req, res, next) => {
  // #swagger.tags=['Restaurant']
  try {
    if (CommonUtils.checkNullOrUndefined(req.body)) {
      throw new BadRequestError('Dữ liệu là bắt buộc')
    }
    const result = await RestaurantService.createRestaurant(req.user.id, req.body)
    next(new Response(201, 'Thành Công', result).resposeHandler(res))
  } catch (error) {
    next(new Response(error.statusCode || 500, error.message, null).resposeHandler(res))
  }
}

const updateRestaurant = async (req, res, next) => {
  // #swagger.tags=['Restaurant']
  try {
    if (CommonUtils.checkNullOrUndefined(req.body)) {
      throw new BadRequestError('Dữ liệu là bắt buộc')
    }
    const result = await RestaurantService.updateRestaurant(req.params.id, req.body)
    next(new Response(200, 'Thành Công', result).resposeHandler(res))
  } catch (error) {
    next(new Response(error.statusCode || 500, error.message, null).resposeHandler(res))
  }
}

const deleteRestaurant = async (req, res, next) => {
  // #swagger.tags=['Restaurant']
  try {
    const result = await RestaurantService.deleteRestaurant(req.params.id)
    next(new Response(HttpStatusCode.Accepted, 'Thành Công', result).resposeHandler(res))
  } catch (error) {
    next(new Response(error.statusCode || 500, error.message, null).resposeHandler(res))
  }
}

const getFourNearestRestaurant = async (req, res, next) => {
  // #swagger.tags=['Restaurant']
  try {
    const data = await RestaurantService.getFourNearestRestaurant(req.query)
    next(new Response(200, 'Thành Công', data).resposeHandler(res))
  } catch (error) {
    next(new Response(error.statusCode || 500, error.message, null).resposeHandler(res))
  }
}

const getDistanceFromRestaurant = async (req, res, next) => {
  // #swagger.tags=['Restaurant']
  try {
    const data = await RestaurantService.getDistanceFromRestaurant(req.query)
    next(new Response(200, 'Thành Công', data).resposeHandler(res))
  } catch (error) {
    next(new Response(error.statusCode || 500, error.message, null).resposeHandler(res))
  }
}

const findRestaurantByAnyField = async (req, res, next) => {
  // #swagger.tags=['Restaurant']
  try {
    const { page, size } = req.query
    const { searchTerm } = req.body
    if (!searchTerm) {
      throw new BadRequestError('Giá trị tìm kiếm là bắt buộc')
    }
    const result = await RestaurantService.findRestaurantsByAnyField(searchTerm, page, size)
    next(new Response(200, 'Đã tìm thấy nhà hàng', result.data, result.info).resposeHandler(res))
  } catch (error) {
    next(new Response(error.statusCode || 500, error.message, null).resposeHandler(res))
  }
}

const countRestaurant = async (req, res, next) => {
  try {
    const result = await RestaurantService.countRestaurant()
    next(new Response(200, 'Thành Công', result).resposeHandler(res))
  } catch (error) {
    next(new Response(error.statusCode || 500, error.message, null).resposeHandler(res))
  }
}

export const RestaurantController = {
  getAllRestaurant,
  getRestaurantById,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
  getFourNearestRestaurant,
  getDistanceFromRestaurant,
  findRestaurantByAnyField,
  countRestaurant
}
