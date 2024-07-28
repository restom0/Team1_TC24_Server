import express from 'express'
import { RestaurantController } from '../controllers/restaurant.controller.js'
import {
  RestaurangGetAllValidation,
  RestaurantCreateValidation,
  RestaurantDeleteValidation,
  RestaurantGetByIdValidation,
  RestaurantUpdateValidation
} from '../dto/in/restaurant.dto.js'
import { handleValidationErrors } from '../middlewares/validation.middleware.js'
import { authenticationAdmin, requireApiKey } from '../middlewares/useApiKey.middleware.js'
const RestaurantRouter = express.Router()

RestaurantRouter.get('/', RestaurangGetAllValidation, handleValidationErrors, RestaurantController.getAllRestaurant)
RestaurantRouter.get(
  '/restaurnt/:id',
  RestaurantGetByIdValidation,
  handleValidationErrors,
  RestaurantController.getRestaurantById
)
RestaurantRouter.post(
  '/',
  RestaurantCreateValidation,
  handleValidationErrors,
  requireApiKey,
  authenticationAdmin,
  RestaurantController.createRestaurant
)
RestaurantRouter.put(
  '/restaurant/:id',
  RestaurantUpdateValidation,
  handleValidationErrors,
  requireApiKey,
  authenticationAdmin,
  RestaurantController.updateRestaurant
)
RestaurantRouter.delete(
  '/restaurant/:id',
  RestaurantDeleteValidation,
  handleValidationErrors,
  requireApiKey,
  authenticationAdmin,
  RestaurantController.deleteRestaurant
)
RestaurantRouter.post('/find-restaurant', RestaurantController.findRestaurantByAnyField)
RestaurantRouter.get('/total-restaurant', requireApiKey, authenticationAdmin, RestaurantController.countRestaurant)

export { RestaurantRouter }
