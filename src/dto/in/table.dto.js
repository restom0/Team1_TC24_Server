import { body, param } from 'express-validator'
const TableGetById = [param('id').notEmpty().withMessage('Thiếu ID').isMongoId().withMessage('Invalid ID')]

const TableCreateValidation = [
  body('tableNumber').notEmpty().withMessage('Thiếu số bàn').isNumeric().withMessage('Table number must be a number'),
  body('restaurantID').notEmpty().withMessage('Thiếu ID nhà hàng').isMongoId().withMessage('Invalid restaurant ID')
]

const TableUpdateValidation = [
  body('tableNumber').notEmpty().withMessage('Thiếu số bàn').isNumeric().withMessage('Table number must be a number'),
  body('status').notEmpty().withMessage('Thiếu trạng thái').isBoolean().withMessage('Status must be a boolean'),
  body('restaurantID').notEmpty().withMessage('Thiếu ID nhà hàng').isMongoId().withMessage('Invalid restaurant ID')
]

const TableDeleteValidation = [param('id').notEmpty().withMessage('Thiếu ID').isMongoId().withMessage('Invalid ID')]

export { TableGetById, TableCreateValidation, TableUpdateValidation, TableDeleteValidation }
