import { HttpStatusCode } from 'axios'
import { Response } from '../dto/response/response.js'
import { BadRequestError } from '../errors/badRequest.error.js'
import { NotFoundError } from '../errors/notFound.error.js'
import { RestaurantService } from '../services/restaurant.service.js'
import { CommonUtils } from '../utils/common.util.js'

const getAllRestaurant = async (req, res) => {
  try {
    const data = await RestaurantService.getAllRestaurant()
    Response(200, 'Success', data).resposeHandler(res)
  } catch (error) {
    res.status(error.statusCode).json({ error: error.message })
  }
}

const getRestaurantById = async (req, res) => {
  try {
    const data = await RestaurantService.getRestaurantById(req.params.id)
    Response(200, 'Success', data).resposeHandler(res)
  } catch (error) {
    Response(error.statusCode, error.message, null).resposeHandler(res)
  }
}

const createRestaurant = async (req, res) => {
  try {
    if (CommonUtils.checkNullOrUndefined(req.body)) {
      throw new BadRequestError('Data is required')
    }
    const result = await RestaurantService.createRestaurant(...req.body)
    Response(201, 'Success', result).resposeHandler(res)
  } catch (error) {
    Response(error.statusCode, error.message, null).resposeHandler(res)
  }
}

const updateRestaurant = async (req, res) => {
  try {
    if (CommonUtils.checkNullOrUndefined(req.body)) {
      throw new BadRequestError('Data is required')
    }
    const result = await RestaurantService.updateRestaurant(req.params.id, ...req.body)
    Response(200, 'Success', result).resposeHandler(res)
  } catch (error) {
    Response(error.statusCode, error.message, null).resposeHandler(res)
  }
}

const deleteRestaurant = async (req, res) => {
  try {
    const result = await RestaurantService.deleteRestaurant(req.params.id)
    Response(HttpStatusCode.Accepted, 'Success', result).resposeHandler(res)
  } catch (error) {
    Response(error.statusCode, error.message, null).resposeHandler(res)
  }
}

export const RestaurantController = {
  getAllRestaurant,
  getRestaurantById,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant
}
