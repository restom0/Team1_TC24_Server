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
  '/:id',
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
RestaurantRouter.put('/:id', RestaurantUpdateValidation, handleValidationErrors, RestaurantController.updateRestaurant)
RestaurantRouter.delete(
  '/:id',
  RestaurantDeleteValidation,
  handleValidationErrors,
  RestaurantController.deleteRestaurant
)

export { RestaurantRouter }
