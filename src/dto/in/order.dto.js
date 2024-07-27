import { body, param } from 'express-validator'
import { PAYMENT_STATUS } from '../../constants/payment_status.constant.js'
import { PAYMENT_METHOD } from '../../constants/payment_method.constant.js'
const OrderGetAllValidation = []
const OrderGetByIdValidation = [
  param('id').trim().notEmpty().withMessage('Thiếu id').isString().withMessage('Id phải là chuỗi')
]
const OrderCreateValidation = [
  body('tableId').trim().notEmpty().withMessage('Thiếu mã bàn').isMongoId().withMessage('Mã bàn không hợp lệ'),
  body('totalPeople')
    .trim()
    .notEmpty()
    .withMessage('Thiếu tổng số người')
    .isNumeric()
    .withMessage('Tổng số người phải là số'),
  body('name').trim().notEmpty().withMessage('Thiếu tên').isString().withMessage('Tên phải là chuỗi'),
  body('phone_number')
    .trim()
    .notEmpty()
    .withMessage('Thiếu số điện thoại')
    .isMobilePhone('vi-VN')
    .withMessage('Số điện thoại không hợp lệ'),
  body('payment')
    .trim()
    .notEmpty()
    .withMessage('Thiếu hình thức thanh toán')
    .isString()
    .withMessage('Hình thức thanh toán phải là chuỗi')
    .custom((value) => {
      return PAYMENT_METHOD.includes(value)
    })
    .withMessage('Hình thức thanh toán không hợp lệ'),
  body('menu').trim().notEmpty().withMessage('Thiếu menu').isArray().withMessage('menu phải là mảng'),
  body('menu._id').trim().notEmpty().withMessage('Thiếu menu').isMongoId().withMessage('menu không hợp lệ'),
  body('menu.quantity')
    .trim()
    .isNumeric()
    .withMessage('Số lượng menu là số')
    .notEmpty()
    .withMessage('Thiếu số lượng menu'),
  body('checkin')
    .trim()
    .notEmpty()
    .withMessage('Thiếu ngày checkin')
    .isDate()
    .withMessage('Ngày checkin không hợp lệ')
    .isAfter(Date.now)
    .withMessage('Ngày checkin không hợp lệ'),
  body('restaurantId')
    .trim()
    .notEmpty()
    .withMessage('Thiếu mã nhà hàng')
    .isMongoId()
    .withMessage('nhà hàng không hợp lệ'),
  body('totalOrder')
    .trim()
    .notEmpty()
    .withMessage('Thiếu tổng hóa đơn')
    .isNumeric()
    .withMessage('Tổng hóa đơn phải là số')
]

const OrderUpdateValidation = [
  param('id').trim().notEmpty().withMessage('Thiếu id').isMongoId().withMessage('Id không hợp lệ'),
  body('tableId').trim().notEmpty().withMessage('Thiếu tableId').isArray().withMessage('tableId phải là mảng'),
  body('tableId.*').trim().notEmpty().withMessage('Thiếu tableId').isMongoId().withMessage('tableId không hợp lệ'),
  body('name').trim().notEmpty().withMessage('Thiếu tên').isString().withMessage('Tên phải là chuỗi'),
  body('phone_number')
    .trim()
    .notEmpty()
    .withMessage('Thiếu số điện thoại')
    .isMobilePhone('vi-VN')
    .withMessage('Số điện thoại không hợp lệ'),
  body('payment')
    .trim()
    .notEmpty()
    .withMessage('Thiếu hình thức thanh toán')
    .isString()
    .withMessage('Hình thức thanh toán phải là chuỗi')
    .custom((value) => {
      return PAYMENT_METHOD.includes(value)
    })
    .withMessage('Hình thức thanh toán không hợp lệ'),
  body('menu').trim().notEmpty().withMessage('Thiếu menu').isArray().withMessage('menu phải là mảng'),
  body('menu.*').trim().notEmpty().withMessage('Thiếu menu').isMongoId().withMessage('menu không hợp lệ'),
  body('status')
    .trim()
    .notEmpty()
    .withMessage('Thiếu trạng thái')
    .isString()
    .withMessage('Trạng thái phải là chuỗi')
    .custom((value) => {
      return PAYMENT_STATUS.includes(value)
    })
    .withMessage('Trạng thái không hợp lệ'),
  body('checkin')
    .trim()
    .notEmpty()
    .withMessage('Thiếu ngày checkin')
    .isDate()
    .withMessage('Ngày checkin không hợp lệ')
    .isAfter(Date.now)
    .withMessage('Ngày checkin không hợp lệ')
]
const OrderDeleteValidation = [
  param('id').trim().notEmpty().withMessage('Thiếu id').isMongoId().withMessage('Id phải là chuỗi')
]
export {
  OrderGetAllValidation,
  OrderGetByIdValidation,
  OrderCreateValidation,
  OrderUpdateValidation,
  OrderDeleteValidation
}
