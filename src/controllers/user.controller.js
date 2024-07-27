import { Response } from '../dto/response/response.js'
import { BadRequestError } from '../errors/badRequest.error.js'
import { MailService } from '../services/mail.service.js'
import { UserService } from '../services/user.service.js'
import { CommonUtils } from '../utils/common.util.js'

const login = async (req, res, next) => {
  try {
    // #swagger.tags=['User']
    if (CommonUtils.checkNullOrUndefined(req.body)) {
      throw new BadRequestError('Tài khoản là bắt buộc')
    }
    const result = await UserService.login(req.body)
    return new Response(200, 'Đăng nhập thành công', result).resposeHandler(res)
  } catch (error) {
    if (!res.headersSent) {
      return new Response(error.statusCode || 500, error.message, null).resposeHandler(res)
    }
    next(error)
  }
}

const adminLogin = async (req, res, next) => {
  try {
    const result = await UserService.adminLogin(req.body)
    return new Response(200, 'Đăng nhập thành công', result).resposeHandler(res)
  } catch (error) {
    if (!res.headersSent) {
      return new Response(error.statusCode || 500, error.message, null).resposeHandler(res)
    }
    next(error)
  }
}

const register = async (req, res, next) => {
  try {
    // #swagger.tags=['User']
    if (CommonUtils.checkNullOrUndefined(req.body)) {
      throw new BadRequestError('Tài khoản là bắt buộc')
    }
    const result = await UserService.register(req.body)
    return new Response(200, 'Đăng ký thành công', result).resposeHandler(res)
  } catch (error) {
    if (!res.headersSent) {
      return new Response(error.statusCode || 500, error.message, null).resposeHandler(res)
    }
    next(error)
  }
}
const registerStaff = async (req, res, next) => {
  try {
    // #swagger.tags=['User']
    if (CommonUtils.checkNullOrUndefined(req.body)) {
      throw new BadRequestError('Tài khoản là bắt buộc')
    }
    const result = await UserService.registerStaff(req.body)
    return new Response(200, 'Đăng ký thành công', result).resposeHandler(res)
  } catch (error) {
    if (!res.headersSent) {
      return new Response(error.statusCode || 500, error.message, null).resposeHandler(res)
    }
    next(error)
  }
}
const sendMail = async (req, res, next) => {
  try {
    // #swagger.tags=['User']
    if (CommonUtils.checkNullOrUndefined(req.body)) {
      throw new BadRequestError('Username is required')
    }
    const result = await UserService.registerStaff(req.body)
    return new Response(200, 'Đăng ký thành công', result).resposeHandler(res)
  } catch (error) {
    if (!res.headersSent) {
      return new Response(error.statusCode || 500, error.message, null).resposeHandler(res)
    }
    next(error)
  }
}

const sendResetPasswordEmail = async (req, res, next) => {
  try {
    const { to } = req.body

    if (!to) {
      return new Response(400, 'Email là bắt buộc').resposeHandler(res)
    }

    const result = await MailService.sendResetPasswordMail(to)
    return new Response(200, 'Gửi thành công', result).resposeHandler(res)
  } catch (error) {
    return new Response(error.statusCode || 500, error.message, null).resposeHandler(res)
  }
}

const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params
    const user = await UserService.getUserById(id)
    if (!user) {
      throw new BadRequestError('Không thấy tài khoản')
    }
    new Response(200, 'Đã tìm thấy tài khoản', user).resposeHandler(res)
  } catch (error) {
    new Response(error.statusCode || 500, error.message, null).resposeHandler(res)
    next(error)
  }
}

const getAllUsers = async (req, res, next) => {
  try {
    const users = await UserService.getAllUsers()
    new Response(200, 'Đã tìm thấy tài khoản', users).resposeHandler(res)
  } catch (error) {
    new Response(500, error.message, null).resposeHandler(res)
    next(error)
  }
}

const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params
    const user = await UserService.deleteUser(id)
    if (!user) {
      throw new BadRequestError('Không thấy tài khoản')
    }
    new Response(200, 'Xóa tài khoản thành công', null).resposeHandler(res)
  } catch (error) {
    new Response(error.statusCode || 500, error.message, null).resposeHandler(res)
    next(error)
  }
}

const resetPassword = async (req, res, next) => {
  try {
    const { code, newPassword } = req.body
    const result = await UserService.resetPassword(code, newPassword)
    return new Response(200, 'Đổi mật khẩu thành công', result).resposeHandler(res)
  } catch (error) {
    return new Response(error.statusCode || 500, error.message, null).resposeHandler(res)
  }
}

const findUsersByAnyField = async (req, res, next) => {
  try {
    const { searchTerm } = req.body
    if (!searchTerm) {
      throw new BadRequestError('Giá trị tìm kiếm là bắt buộc')
    }
    const result = await UserService.findUsersByAnyField(searchTerm)
    if (result.length === 0) {
      return new Response(404, 'Không tìm thấy tài khoản', null).resposeHandler(res)
    }
    return new Response(200, 'Đã tìm thấy tài khoản', result).resposeHandler(res)
  } catch (error) {
    return new Response(error.statusCode || 500, error.message, null).resposeHandler(res)
  }
}

export const UserController = {
  login,
  register,
  getUserById,
  getAllUsers,
  deleteUser,
  registerStaff,
  sendResetPasswordEmail,
  resetPassword,
  sendMail,
  adminLogin,
  findUsersByAnyField
}
