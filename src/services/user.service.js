import { USER_ROLE } from '../constants/user.constant.js'
import { BadRequestError } from '../errors/badRequest.error.js'
import { ForbiddenRequestError } from '../errors/forbiddenRequest.error.js'
import { createApiKey } from '../middlewares/useApiKey.middleware.js'
import { UserModel } from '../models/users.model.js'
import mongoose, { Types } from 'mongoose'
import jwt from 'jsonwebtoken'
import { NotFoundError } from '../errors/notFound.error.js'
import { createHash, checkPassword } from '../middlewares/usePassword.js'
import { MailService } from './mail.service.js'

const login = async ({ username, password }) => {
  const user = await UserModel.findOne({ username }).exec()
  if (!user) {
    throw new BadRequestError('Username or password is incorrect')
  }
  const isPasswordValid = await checkPassword(password, user.password)
  if (!isPasswordValid) {
    throw new BadRequestError('Username or password is incorrect')
  }
  if (user.salt === undefined || user.salt === null || user.salt === '') {
    throw new BadRequestError('Tài khoản đã bị khóa')
  }
  return createApiKey(user._id, user.role)
}
const adminLogin = async ({ username, password }) => {
  const user = await UserModel.findOne({ username }).exec()

  if (!user) {
    throw new BadRequestError('Invalid username or password')
  }

  const isPasswordValid = await checkPassword(password, user.password)
  if (!isPasswordValid) {
    throw new BadRequestError('Invalid username or password')
  }

  // Kiểm tra vai trò của người dùng và trả về thông tin tương ứng
  if (user.role === USER_ROLE.ADMIN) {
    return {
      redirect_url: '/dashboard',
      token: createApiKey(user._id, user.role)
    }
  } else if (user.role === USER_ROLE.STAFF) {
    return {
      redirect_url: '/staff',
      token: createApiKey(user._id, user.role)
    }
  } else {
    throw new BadRequestError('Invalid role')
  }
}

const register = async ({ username, password, phone, email, name }) => {
  if (await UserModel.findOne({ username })) {
    throw new BadRequestError('Account existed')
  }
  const user = new UserModel({
    _id: new Types.ObjectId(),
    username,
    password: await createHash(password),
    phone,
    email,
    name,
    role: USER_ROLE.USER,
    salt: createApiKey(Math.random().toString(36).substring(2))
  })
  return await user.save()
}
const registerStaff = async ({ username, password, phone, email, name }) => {
  if (await UserModel.findOne({ username })) {
    throw new BadRequestError('Account existed')
  }
  const user = new UserModel({
    _id: new Types.ObjectId(),
    username,
    password: await createHash(password),
    phone,
    email,
    name,
    role: USER_ROLE.STAFF,
    salt: createApiKey(Math.random().toString(36).substring(2))
  })

  MailService.sendMail({
    to: email,
    subject: 'Wellcome to Mindx Restaurant',
    html: `<h1>User name của bạn là: <strong>${username} </h1><p>Password của bạn là: <strong>${password}</strong></p>`
  })

  return await user.save()
}
const authorize = async (id) => {
  id = Types.ObjectId.createFromHexString(id)
  return await UserModel.findById(id)
}
const checkKey = async ({ id, email }) => {
  id = Types.ObjectId.createFromHexString(id)
  return await UserModel.find({ _id: id, email })
}

const countUser = async () => {
  return await UserModel.countDocuments({ deleted_at: null })
}

const getUserById = async (id) => {
  id = Types.ObjectId.createFromHexString(id)
  return await UserModel.findById(id)
}

const getAllUsers = async () => {
  return await UserModel.find({ role: USER_ROLE.STAFF }).exec()
}

const deleteUser = async (id) => {
  id = Types.ObjectId.createFromHexString(id)
  return await UserModel.findByIdAndDelete(id)
}

const resetPassword = async (code, newPassword) => {
  jwt.verify(code, 'secret', async (err, decoded) => {
    if (err || !decoded) {
      throw new BadRequestError('Invalid access')
    } else {
      const result = await checkKey(decoded.data)
      if (result.length === 0) {
        throw new NotFoundError('User not found')
      }

      const hashedPassword = createHash(newPassword)

      await UserModel.updateOne({ _id: result[0]._id }, { password: hashedPassword, updated_at: Date.now() })
    }
  })
  return true
}

const findUsersByAnyField = async (searchTerm) => {
  const isObjectId = mongoose.Types.ObjectId.isValid(searchTerm)
  const query = {
    $or: [
      ...(isObjectId ? [{ _id: new mongoose.Types.ObjectId(searchTerm) }] : []),
      { username: { $regex: searchTerm, $options: 'i' } },
      { email: { $regex: searchTerm, $options: 'i' } },
      { phone: { $regex: searchTerm, $options: 'i' } },
      { name: { $regex: searchTerm, $options: 'i' } }
    ]
  }
  return await UserModel.find(query).lean()
}

export const UserService = {
  login,
  register,
  authorize,
  getUserById,
  getAllUsers,
  deleteUser,
  registerStaff,
  resetPassword,
  adminLogin,
  findUsersByAnyField
}
