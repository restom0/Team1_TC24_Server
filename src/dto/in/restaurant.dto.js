import { body, param } from 'express-validator'

const RestaurangGetAllValidation = []

const RestaurantGetByIdValidation = [
  param('id').notEmpty().withMessage('Thiếu id').isString().withMessage('Id phải là chuỗi')
]

const RestaurantCreateValidation = [
  body('name').notEmpty().withMessage('Thiếu tên nhà hàng').isString().withMessage('Tên nhà hàng phải là chuỗi'),
  body('address').notEmpty().withMessage('Thiếu địa chỉ').isString().withMessage('Địa chỉ phải là chuỗi'),
  body('openTime').notEmpty().withMessage('Thiếu giờ mở cửa').isNumeric().withMessage('Giờ mở cửa phải là số'),
  body('closeTime').notEmpty().withMessage('Thiếu giờ đóng cửa').isNumeric().withMessage('Giờ đóng cửa phải là số'),
  body('description').notEmpty().withMessage('Thiếu mô tả').isString().withMessage('Mô tả phải là chuỗi'),
  body('imageUrls').notEmpty().withMessage('Thiếu ảnh').isString().withMessage('Ảnh phải là chuỗi')
]

const RestaurantUpdateValidation = [
  param('id').notEmpty().withMessage('Thiếu id').isString().withMessage('Id phải là chuỗi'),
  body('name').notEmpty().withMessage('Thiếu tên nhà hàng').isString().withMessage('Tên nhà hàng phải là chuỗi'),
  body('address').notEmpty().withMessage('Thiếu address').isString().withMessage('Địa chỉ phải là chuỗi'),
  body('openTime').notEmpty().isNumeric().withMessage('Giờ mở cửa phải là số'),
  body('closeTime').notEmpty().isNumeric().withMessage('Giờ đóng cửa phải là số'),
  body('description').notEmpty().isString().withMessage('Mô tả phải là chuỗi'),
  body('imageUrls').notEmpty().isString().withMessage('Ảnh phải là chuỗi')
]

const RestaurantDeleteValidation = [
  param('id').notEmpty().withMessage('Thiếu id').isString().withMessage('Id phải là chuỗi')
]
export {
  RestaurantCreateValidation,
  RestaurantUpdateValidation,
  RestaurantDeleteValidation,
  RestaurantGetByIdValidation,
  RestaurangGetAllValidation
}
