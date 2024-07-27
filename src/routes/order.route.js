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
OrderRouter.get('/direct/confirm/:id', OrderController.confirmDirectOrder)
OrderRouter.post('/pay/:id', OrderGetByIdValidation, handleValidationErrors, OrderController.payOrder)
OrderRouter.post('/', requireApiKey, OrderCreateValidation, handleValidationErrors, OrderController.createOrder)
OrderRouter.post(
  '/direct',
  requireApiKey,
  OrderCreateValidation,
  handleValidationErrors,
  OrderController.createDirectOrder
)

OrderRouter.put('/menu/:id', OrderUpdateValidation, handleValidationErrors, OrderController.updateOrder)
OrderRouter.delete('/:id', OrderDeleteValidation, handleValidationErrors, OrderController.deleteOrder)
OrderRouter.put('/checkout/:id', OrderController.updateCheckout)
OrderRouter.put('/checkin/:id', OrderController.updateCheckin)

export { OrderRouter }
