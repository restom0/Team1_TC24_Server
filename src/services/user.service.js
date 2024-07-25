import { USER_ROLE } from '../constants/user.constant.js'
import { BadRequestError } from '../errors/badRequest.error.js'
import { createApiKey } from '../middlewares/useApiKey.middleware.js'
import { UserModel } from '../models/users.model.js'
import { Types } from 'mongoose'
const login = async ({ username, password }) => {
  const user = await UserModel.findOne({ username, password }).exec()
  if (!user) {
    throw new BadRequestError('Username or password is incorrect')
  }
  if (user.salt === undefined || user.salt === null || user.salt === '') {
    throw new BadRequestError('Tài khoản đã bị khóa')
  }
  return createApiKey(user._id, user.role)
}
const register = async ({ username, password, phone, email, name }) => {
  if (await UserModel.findOne({ username })) {
    throw new BadRequestError('Account existed')
  }
  console.log(username, password, phone, email, name)
  const user = new UserModel({
    _id: new Types.ObjectId(),
    username,
    password,
    phone,
    email,
    name,
    role: USER_ROLE.USER,
    salt: createApiKey(Math.random().toString(36).substring(2))
  })
  return await user.save()
}
const authorize = async (id) => {
  id = Types.ObjectId.createFromHexString(id)
  return await UserModel.findById(id)
}
export const UserService = { login, register, authorize }
