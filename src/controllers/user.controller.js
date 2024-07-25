import { Response } from '../dto/response/response.js'
import { BadRequestError } from '../errors/badRequest.error.js'
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
    return new Response(error.statusCode, error.message, null).resposeHandler(res)
  }
}
const register = async (req, res, next) => {
  try {
    // #swagger.tags=['User']
    if (CommonUtils.checkNullOrUndefined(req.body)) {
      throw new BadRequestError('Username is required')
    }
    await UserService.register(req.body)
    return new Response(201, 'Register success', null).resposeHandler(res)
  } catch (error) {
    return new Response(500, error._message, error.errors).resposeHandler(res)
  }
}

export const UserController = { login, register }
