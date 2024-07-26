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
  body('email').notEmpty().withMessage('Email is required').isEmail().withMessage('Email must be a valid email'),
  body('phone')
    .notEmpty()
    .withMessage('Phone is required')
    .isString()
    .withMessage('Phone must be a string')
    .isMobilePhone('vi-VN')
    .withMessage('Phone must be a valid phone number'),

  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isString()
    .withMessage('Password must be a string')
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/)
    .withMessage(
      'Password must be at least 8 characters long, contain at least one number, one capital letter, one lowercase letter and one special character'
    ),
  body('name').notEmpty().withMessage('Name is required').isString().withMessage('Name must be a string')
]
const UserChangePasswordValidation = [
  body('password').notEmpty().withMessage('Password is required').isString().withMessage('Password must be a string')
]
export { UserLoginValidation, UserRegisterValidation, UserChangePasswordValidation }
