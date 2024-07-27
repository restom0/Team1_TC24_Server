import { body } from 'express-validator'

const UserLoginValidation = [
  (body('username') || body('phone'))
    .trim()
    .notEmpty()
    .withMessage('Tên đăng nhập là bắt buộc')
    .isString()
    .withMessage('Tên đăng nhập phải là một chuỗi'),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('Mật khẩu là bắt buộc')
    .isString()
    .withMessage('Mật khẩu phải là một chuỗi')
]

const UserRegisterValidation = [
  body('username')
    .trim()
    .notEmpty()
    .withMessage('Tên đăng nhập là bắt buộc')
    .isString()
    .withMessage('Tên đăng nhập phải là một chuỗi'),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('Mật khẩu là bắt buộc')
    .isString()
    .withMessage('Mật khẩu phải là một chuỗi'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email là bắt buộc')
    .isEmail()
    .withMessage('Email phải là một email hợp lệ'),
  body('phone')
    .trim()
    .notEmpty()
    .withMessage('Số điện thoại là bắt buộc')
    .isString()
    .withMessage('Số điện thoại phải là một chuỗi')
    .isMobilePhone('vi-VN')
    .withMessage('Số điện thoại phải là một số điện thoại hợp lệ'),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('Mật khẩu là bắt buộc')
    .isString()
    .withMessage('Mật khẩu phải là một chuỗi')
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/)
    .withMessage(
      'Mật khẩu phải có ít nhất 8 ký tự, bao gồm ít nhất một số, một chữ cái in hoa, một chữ cái thường và một ký tự đặc biệt'
    ),
  body('name').trim().notEmpty().withMessage('Tên là bắt buộc').isString().withMessage('Tên phải là một chuỗi')
]

const UserChangePasswordValidation = [
  body('password')
    .trim()
    .notEmpty()
    .withMessage('Mật khẩu là bắt buộc')
    .isString()
    .withMessage('Mật khẩu phải là một chuỗi')
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/)
    .withMessage(
      'Mật khẩu phải có ít nhất 8 ký tự, bao gồm ít nhất một số, một chữ cái in hoa, một chữ cái thường và một ký tự đặc biệt'
    )
]

export { UserLoginValidation, UserRegisterValidation, UserChangePasswordValidation }
