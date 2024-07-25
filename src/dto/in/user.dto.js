import { body } from 'express-validator'

const UserLoginValidation = [
  (body('username') || body('phone'))
    .notEmpty()
    .withMessage('Username is required')
    .isString()
    .withMessage('Username must be a string'),
  body('password').notEmpty().withMessage('Password is required').isString().withMessage('Password must be a string')
]

const UserRegisterValidation = [
  body('username').notEmpty().withMessage('Username is required').isString().withMessage('Username must be a string'),
  body('password').notEmpty().withMessage('Password is required').isString().withMessage('Password must be a string'),
  body('phone')
    .notEmpty()
    .withMessage('Phone is required')
    .isString()
    .withMessage('Phone must be a string')
    .isMobilePhone('vi-VN')
    .withMessage('Phone must be a valid phone number'),
  body('name').notEmpty().withMessage('Name is required').isString().withMessage('Name must be a string')
]
const UserChangePasswordValidation = [
  body('password').notEmpty().withMessage('Password is required').isString().withMessage('Password must be a string')
]
export { UserLoginValidation, UserRegisterValidation, UserChangePasswordValidation }
