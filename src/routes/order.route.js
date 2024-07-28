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
import { authenticationAdmin, authenticationStaff, requireApiKey } from '../middlewares/useApiKey.middleware.js'
const OrderRouter = express.Router()

OrderRouter.get('/', OrderGetAllValidation, handleValidationErrors, requireApiKey, OrderController.getAllOrder)
OrderRouter.get('/order/:id', OrderGetByIdValidation, handleValidationErrors, OrderController.getOrderById)
OrderRouter.get(
  '/confirm/:id',
  requireApiKey,
  OrderGetByIdValidation,
  handleValidationErrors,
  OrderController.confirmOrder
)
OrderRouter.get('/direct/confirm/:id', requireApiKey, OrderController.confirmDirectOrder)
OrderRouter.post('/pay/:id', requireApiKey, OrderGetByIdValidation, handleValidationErrors, OrderController.payOrder)
OrderRouter.post('/', requireApiKey, OrderCreateValidation, handleValidationErrors, OrderController.createOrder)
OrderRouter.post(
  '/direct',
  requireApiKey,
  OrderCreateValidation,
  handleValidationErrors,
  OrderController.createDirectOrder
)

OrderRouter.put(
  '/menu/:id',
  requireApiKey,
  authenticationStaff,
  OrderUpdateValidation,
  handleValidationErrors,
  OrderController.updateOrder
)
OrderRouter.delete('/:id', OrderDeleteValidation, handleValidationErrors, OrderController.deleteOrder)
OrderRouter.put('/checkout/:id', requireApiKey, authenticationStaff, OrderController.updateCheckout)
OrderRouter.put('/checkin/:id', requireApiKey, authenticationStaff, OrderController.updateCheckin)

OrderRouter.get('/checkout', requireApiKey, authenticationStaff, OrderController.getSuccessfulOrders)
OrderRouter.get('/checkin', requireApiKey, authenticationStaff, OrderController.getPendingCashOrders)
OrderRouter.get('/total-revenue', requireApiKey, authenticationAdmin, OrderController.totalRevenueOrder)
OrderRouter.get('/total-order-complete', requireApiKey, authenticationAdmin, OrderController.countCompletedOrders)
OrderRouter.get('/total-order', requireApiKey, authenticationAdmin, OrderController.countOrder)
OrderRouter.get('/total-order-hold', requireApiKey, authenticationAdmin, OrderController.countOrdersByStatus)
OrderRouter.get('/retaurant-name', requireApiKey, authenticationAdmin, OrderController.getMostFrequentRestaurantName)
export { OrderRouter }
