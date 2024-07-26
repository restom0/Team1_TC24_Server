import { body } from 'express-validator'

const UserLoginValidation = [
  (body('username') || body('phone'))
    .trim()
    .notEmpty()
    .withMessage('Username is required')
    .isString()
    .withMessage('Username must be a string'),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required')
    .isString()
    .withMessage('Password must be a string')
]

const UserRegisterValidation = [
  body('username')
    .trim()
    .notEmpty()
    .withMessage('Username is required')
    .isString()
    .withMessage('Username must be a string'),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required')
    .isString()
    .withMessage('Password must be a string'),
  body('email').trim().notEmpty().withMessage('Email is required').isEmail().withMessage('Email must be a valid email'),
  body('phone')
    .trim()
    .notEmpty()
    .withMessage('Phone is required')
    .isString()
    .withMessage('Phone must be a string')
    .isMobilePhone('vi-VN')
    .withMessage('Phone must be a valid phone number'),

  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required')
    .isString()
    .withMessage('Password must be a string')
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/)
    .withMessage(
      'Password must be at least 8 characters long, contain at least one number, one capital letter, one lowercase letter and one special character'
    ),
  body('name').trim().notEmpty().withMessage('Name is required').isString().withMessage('Name must be a string')
]
const UserChangePasswordValidation = [
  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required')
    .isString()
    .withMessage('Password must be a string')
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/)
    .withMessage(
      'Password must be at least 8 characters long, contain at least one number, one capital letter, one lowercase letter and one special character'
    )
]
export { UserLoginValidation, UserRegisterValidation, UserChangePasswordValidation }
