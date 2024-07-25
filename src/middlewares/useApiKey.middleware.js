import { Types } from 'mongoose'
import { UserService } from '../services/user.service.js'
import { CommonUtils } from '../utils/common.util.js'
import jwt from 'jsonwebtoken'
import { NotFoundError } from '../errors/notFound.error.js'
import { ForbiddenRequestError } from '../errors/forbiddenRequest.error.js'
import { UnAuthorizedError } from '../errors/unauthorizedRequest.error.js'

export const createApiKey = (data) => {
  const token = jwt.sign(
    {
      exp: Math.floor(Date.now() / 1000) + 8 * 60 * 60,
      data
    },
    'secret'
  )
  return token
}
export const requireApiKey = async (req, res, next) => {
  try {
    if (CommonUtils.checkNullOrUndefined(req.headers.authorization)) {
      throw new UnAuthorizedError('You need to login')
    }
    const apiKey = req.headers.authorization.split(' ')[1]
    jwt.verify(apiKey, 'secret', async (err, decoded) => {
      if (err || !decoded) {
        throw new ForbiddenRequestError('Invalid access')
      } else {
        const result = await UserService.authorize(decoded.data)
        if (CommonUtils.checkNullOrUndefined(result)) {
          throw new NotFoundError('User not found')
        }
        req.user = {
          id: Types.ObjectId.createFromHexString(decoded.data),
          role: result.role
        }
        next()
      }
    })
  } catch (error) {
    Response(error.statusCode, error.message, null).resposeHandler(res)
  }
}

export const authentication = async (req, res, next) => {
  try {
    if (
      CommonUtils.checkNullOrUndefined(req.user) ||
      CommonUtils.checkNullOrUndefined(req.user.role) ||
      CommonUtils.checkNullOrUndefined(req.user.id)
    ) {
      throw new UnAuthorizedError('Invalid access')
    }
    if (req.user.role !== 'ADMIN') {
      throw new ForbiddenRequestError('Invalid access')
    }
    next()
  } catch (error) {
    Response(error.statusCode, error.message, null).resposeHandler(res)
  }
}
