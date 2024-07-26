import { Response } from '../dto/response/response.js'
import { BadRequestError } from '../errors/badRequest.error.js'
import { MailService } from '../services/mail.service.js'
import { UserService } from '../services/user.service.js'
import { CommonUtils } from '../utils/common.util.js'

const login = async (req, res, next) => {
  try {
    // #swagger.tags=['User']
    if (CommonUtils.checkNullOrUndefined(req.body)) {
      throw new BadRequestError('Username is required')
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

const register = async (req, res, next) => {
  try {
    // #swagger.tags=['User']
    if (CommonUtils.checkNullOrUndefined(req.body)) {
      throw new BadRequestError('Username is required')
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
const sendMail = async (req, res, next) => {
  try {
    // #swagger.tags=['User']
    return new Response(200, 'Đăng ký thành công', MailService.sendMail(req.body)).resposeHandler(res)
  } catch (error) {
    if (!res.headersSent) {
      return new Response(error.statusCode || 500, error.message, null).resposeHandler(res)
    }
    next(error)
  }
}

const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params
    const user = await UserService.getUserById(id)
    if (!user) {
      throw new BadRequestError('User not found')
    }
    new Response(200, 'User fetched successfully', user).resposeHandler(res)
  } catch (error) {
    new Response(error.statusCode || 500, error.message, null).resposeHandler(res)
  }
}

const getAllUsers = async (req, res, next) => {
  try {
    const users = await UserService.getAllUsers()
    new Response(200, 'Users fetched successfully', users).resposeHandler(res)
  } catch (error) {
    new Response(500, error.message, null).resposeHandler(res)
  }
}

const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params
    const user = await UserService.deleteUser(id)
    if (!user) {
      throw new BadRequestError('User not found')
    }
    new Response(200, 'User deleted successfully', null).resposeHandler(res)
  } catch (error) {
    new Response(error.statusCode || 500, error.message, null).resposeHandler(res)
  }
}

export const UserController = { login, register, getUserById, getAllUsers, deleteUser, registerStaff }
