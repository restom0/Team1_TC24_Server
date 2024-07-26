import { body, param } from 'express-validator'
const TableGetById = [param('id').trim().notEmpty().withMessage('Thiếu ID').isMongoId().withMessage('Invalid ID')]

const TableCreateValidation = [
  body('tableNumber')
    .trim()
    .notEmpty()
    .withMessage('Thiếu số bàn')
    .isNumeric()
    .withMessage('Table number must be a number'),
  body('restaurantID')
    .trim()
    .notEmpty()
    .withMessage('Thiếu ID nhà hàng')
    .isMongoId()
    .withMessage('Invalid restaurant ID')
]

const TableUpdateValidation = [
  body('tableNumber')
    .trim()
    .notEmpty()
    .withMessage('Thiếu số bàn')
    .isNumeric()
    .withMessage('Table number must be a number'),
  body('status').trim().notEmpty().withMessage('Thiếu trạng thái').isBoolean().withMessage('Status must be a boolean'),
  body('restaurantID')
    .trim()
    .notEmpty()
    .withMessage('Thiếu ID nhà hàng')
    .isMongoId()
    .withMessage('Invalid restaurant ID')
]

const TableDeleteValidation = [
  param('id').trim().notEmpty().withMessage('Thiếu ID').isMongoId().withMessage('Invalid ID')
]

export { TableGetById, TableCreateValidation, TableUpdateValidation, TableDeleteValidation }
