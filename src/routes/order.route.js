import express from 'express'
import { OrderController } from '../controllers/order.controller.js'
import {
  OrderCreateValidation,
  OrderDeleteValidation,
  OrderGetAllValidation,
  OrderGetByIdValidation,
  OrderUpdateValidation
} from '../dto/in/order.dto.js'
import { handleValidationErrors } from '../middlewares/validation.middleware.js'
import { requireApiKey } from '../middlewares/useApiKey.middleware.js'
const OrderRouter = express.Router()

OrderRouter.get('/', OrderGetAllValidation, handleValidationErrors, OrderController.getAllOrder)
OrderRouter.get('/:id', OrderGetByIdValidation, handleValidationErrors, OrderController.getOrderById)
OrderRouter.get('/confirm/:id', OrderGetByIdValidation, handleValidationErrors, OrderController.confirmOrder)
OrderRouter.post('/pay/:id', OrderGetByIdValidation, handleValidationErrors, OrderController.payOrder)
OrderRouter.post('/', requireApiKey, OrderCreateValidation, handleValidationErrors, OrderController.createOrder)
OrderRouter.put('/:id', OrderUpdateValidation, handleValidationErrors, OrderController.updateOrder)
OrderRouter.delete('/:id', OrderDeleteValidation, handleValidationErrors, OrderController.deleteOrder)

export { OrderRouter }
