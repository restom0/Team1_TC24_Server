import { body, param } from 'express-validator'
import { PAYMENT_STATUS } from '../../constants/payment_status.constant.js'
import { PAYMENT_METHOD } from '../../constants/payment_method.constant.js'
const OrderGetAllValidation = []
const OrderGetByIdValidation = [
  param('id').notEmpty().withMessage('Thiếu id').isString().withMessage('Id phải là chuỗi')
]
const OrderCreateValidation = [
  body('tableId').notEmpty().withMessage('Thiếu tableId').isArray().withMessage('tableId phải là mảng'),
  body('tableId.*').notEmpty().withMessage('Thiếu tableId').isMongoId().withMessage('tableId không hợp lệ'),
  body('name').notEmpty().withMessage('Thiếu tên').isString().withMessage('Tên phải là chuỗi'),
  body('phone_number')
    .notEmpty()
    .withMessage('Thiếu số điện thoại')
    .isMobilePhone('vi-VN')
    .withMessage('Số điện thoại không hợp lệ'),
  body('payment')
    .notEmpty()
    .withMessage('Thiếu hình thức thanh toán')
    .isString()
    .withMessage('Hình thức thanh toán phải là chuỗi')
    .custom((value) => {
      return PAYMENT_METHOD.includes(value)
    })
    .withMessage('Hình thức thanh toán không hợp lệ'),
  body('menu').notEmpty().withMessage('Thiếu menu').isArray().withMessage('menu phải là mảng'),
  body('menu.*').notEmpty().withMessage('Thiếu menu').isMongoId().withMessage('menu không hợp lệ'),
  body('status')
    .notEmpty()
    .withMessage('Thiếu trạng thái')
    .isString()
    .withMessage('Trạng thái phải là chuỗi')
    .custom((value) => {
      return PAYMENT_STATUS.includes(value)
    })
    .withMessage('Trạng thái không hợp lệ'),
  body('checkin')
    .notEmpty()
    .withMessage('Thiếu ngày checkin')
    .isDate()
    .withMessage('Ngày checkin không hợp lệ')
    .isAfter(Date.now)
    .withMessage('Ngày checkin không hợp lệ')
]

const OrderUpdateValidation = [
  param('id').notEmpty().withMessage('Thiếu id').isMongoId().withMessage('Id không hợp lệ'),
  body('tableId').notEmpty().withMessage('Thiếu tableId').isArray().withMessage('tableId phải là mảng'),
  body('tableId.*').notEmpty().withMessage('Thiếu tableId').isMongoId().withMessage('tableId không hợp lệ'),
  body('name').notEmpty().withMessage('Thiếu tên').isString().withMessage('Tên phải là chuỗi'),
  body('phone_number')
    .notEmpty()
    .withMessage('Thiếu số điện thoại')
    .isMobilePhone('vi-VN')
    .withMessage('Số điện thoại không hợp lệ'),
  body('payment')
    .notEmpty()
    .withMessage('Thiếu hình thức thanh toán')
    .isString()
    .withMessage('Hình thức thanh toán phải là chuỗi')
    .custom((value) => {
      return PAYMENT_METHOD.includes(value)
    })
    .withMessage('Hình thức thanh toán không hợp lệ'),
  body('menu').notEmpty().withMessage('Thiếu menu').isArray().withMessage('menu phải là mảng'),
  body('menu.*').notEmpty().withMessage('Thiếu menu').isMongoId().withMessage('menu không hợp lệ'),
  body('status')
    .notEmpty()
    .withMessage('Thiếu trạng thái')
    .isString()
    .withMessage('Trạng thái phải là chuỗi')
    .custom((value) => {
      return PAYMENT_STATUS.includes(value)
    })
    .withMessage('Trạng thái không hợp lệ'),
  body('checkin')
    .notEmpty()
    .withMessage('Thiếu ngày checkin')
    .isDate()
    .withMessage('Ngày checkin không hợp lệ')
    .isAfter(Date.now)
    .withMessage('Ngày checkin không hợp lệ')
]
const OrderDeleteValidation = [
  param('id').notEmpty().withMessage('Thiếu id').isMongoId().withMessage('Id phải là chuỗi')
]
export {
  OrderGetAllValidation,
  OrderGetByIdValidation,
  OrderCreateValidation,
  OrderUpdateValidation,
  OrderDeleteValidation
}
