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
import { authentication, requireApiKey } from '../middlewares/useApiKey.middleware.js'
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
  authentication,
  RestaurantController.createRestaurant
)
RestaurantRouter.put(
  '/restaurant/:id',
  RestaurantUpdateValidation,
  handleValidationErrors,
  RestaurantController.updateRestaurant
)
RestaurantRouter.delete(
  '/restaurant/:id',
  RestaurantDeleteValidation,
  handleValidationErrors,
  RestaurantController.deleteRestaurant
)
RestaurantRouter.post('/find-restaurant', RestaurantController.findRestaurantByAnyField)
RestaurantRouter.get('/total-restaurant', RestaurantController.countRestaurant)

export { RestaurantRouter }
