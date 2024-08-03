import { Response } from '../dto/response/response.js'
import { BadRequestError } from '../errors/badRequest.error.js'
import { MailService } from '../services/mail.service.js'
import { UserService } from '../services/user.service.js'
import { CommonUtils } from '../utils/common.util.js'

const loginUser = async (req, res, next) => {
  try {
    // #swagger.tags=['User']
    const result = await UserService.login(req.body)
    return new Response(200, 'Đăng nhập thành công', result).resposeHandler(res)
  } catch (error) {
    next(new Response(error.statusCode || 500, error.message, null).resposeHandler(res))
  }
}
const loginAdmin = async (req, res, next) => {
  try {
    const result = await UserService.adminLogin(req.body)
    next(new Response(200, 'Đăng nhập thành công', result).resposeHandler(res))
  } catch (error) {
    next(new Response(error.statusCode || 500, error.message, null).resposeHandler(res))
  }
}
const register = async (req, res, next) => {
  try {
    // #swagger.tags=['User']
    if (CommonUtils.checkNullOrUndefined(req.body)) {
      throw new BadRequestError('Tài khoản là bắt buộc')
    }
    const result = await UserService.register(req.body)
    next(new Response(200, 'Đăng ký thành công', result).resposeHandler(res))
  } catch (error) {
    next(new Response(error.statusCode || 500, error.message, null).resposeHandler(res))
  }
}
const getUserById = async (req, res, next) => {
  try {
    const user = await UserService.getUserById(req.user.id)
    if (!user) {
      throw new BadRequestError('Không thấy tài khoản')
    }
    next(Response(200, 'Đã tìm thấy tài khoản', user).resposeHandler(res))
  } catch (error) {
    next(new Response(error.statusCode || 500, error.message, null).resposeHandler(res))
  }
}
const getAllUsers = async (req, res, next) => {
  try {
    const { page, size } = req.query
    const users = await UserService.getAllUsers(page, size)
    next(new Response(200, 'Đã tìm thấy tài khoản', users.data, users.info).resposeHandler(res))
  } catch (error) {
    next(new Response(error.statusCode || 500, error.message, null).resposeHandler(res))
  }
}
const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params
    const user = await UserService.deleteUser(id)
    if (!user) {
      throw new BadRequestError('Không thấy tài khoản')
    }
    next(new Response(200, 'Xóa tài khoản thành công', null).resposeHandler(res))
  } catch (error) {
    next(new Response(error.statusCode || 500, error.message, null).resposeHandler(res))
  }
}
const registerStaff = async (req, res, next) => {
  try {
    // #swagger.tags=['User']
    const result = await UserService.registerStaff(req.body)
    next(new Response(200, 'Đăng ký thành công', result).resposeHandler(res))
  } catch (error) {
    next(new Response(error.statusCode || 500, error.message, null).resposeHandler(res))
  }
}
const sendResetPasswordEmail = async (req, res, next) => {
  try {
    const { to } = req.body

    if (!to) {
      throw new BadRequestError('Email là bắt buộc')
    }

    const result = await MailService.sendResetPasswordMail(to)
    next(new Response(200, 'Gửi thành công', result).resposeHandler(res))
  } catch (error) {
    next(new Response(error.statusCode || 500, error.message, null).resposeHandler(res))
  }
}
const resetPassword = async (req, res, next) => {
  try {
    const { code, newPassword } = req.body
    const result = await UserService.resetPassword(code, newPassword)
    next(new Response(200, 'Đổi mật khẩu thành công', result).resposeHandler(res))
  } catch (error) {
    next(new Response(error.statusCode || 500, error.message, null).resposeHandler(res))
  }
}
const sendMail = async (req, res, next) => {
  try {
    // #swagger.tags=['User']
    if (CommonUtils.checkNullOrUndefined(req.body)) {
      throw new BadRequestError('Username is required')
    }
    const result = await UserService.registerStaff(req.body)
    next(new Response(200, 'Đăng ký thành công', result).resposeHandler(res))
  } catch (error) {
    next(new Response(error.statusCode || 500, error.message, null).resposeHandler(res))
  }
}
const findUsersByAnyField = async (req, res, next) => {
  try {
    const { page, size } = req.query
    const { searchTerm } = req.body
    const result = await UserService.findUsersByAnyField(searchTerm, page, size)
    if (result.length === 0) {
      return new Response(404, 'Không tìm thấy tài khoản', null).resposeHandler(res)
    }
    next(new Response(200, 'Đã tìm thấy tài khoản', result.data, result.info).resposeHandler(res))
  } catch (error) {
    next(new Response(error.statusCode || 500, error.message, null).resposeHandler(res))
  }
}
export const UserController = {
  loginUser,
  loginAdmin,
  register,
  getUserById,
  getAllUsers,
  deleteUser,
  registerStaff,
  sendResetPasswordEmail,
  resetPassword,
  sendMail,
  findUsersByAnyField
}
