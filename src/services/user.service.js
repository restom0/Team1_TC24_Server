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

const login = async ({ username, email, phone, password }) => {
  const user = username
    ? await UserModel.findOne({ username }).exec()
    : email
      ? await UserModel.findOne({ email }).exec()
      : await UserModel.findOne({ phone })
          .exec()
          .orFail(() => {
            throw new BadRequestError('Username or password is incorrect')
          })
  const isPasswordValid = await checkPassword(password, user.salt, user.password)
  if (!isPasswordValid) {
    throw new BadRequestError('Username or password is incorrect')
  }
  if (user.salt === undefined) {
    throw new BadRequestError('Tài khoản đã bị khóa')
  }
  return createApiKey(user._id, user.role)
}
const adminLogin = async ({ username, email, phone, password }) => {
  const user = username
    ? await UserModel.findOne({ username }).exec()
    : email
      ? await UserModel.findOne({ email }).exec()
      : await UserModel.findOne({ phone })
          .exec()
          .orFail(() => {
            throw new BadRequestError('Username or password is incorrect')
          })
  const isPasswordValid = await checkPassword(password, user.salt, user.password)
  if (!isPasswordValid) {
    throw new BadRequestError('Invalid username or password')
  }

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
  const salt = createApiKey(Math.random().toString(36).substring(2))
  const user = new UserModel({
    _id: new Types.ObjectId(),
    username,
    password: await createHash(password + salt),
    phone,
    email,
    name,
    role: USER_ROLE.USER,
    salt
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
  return UserModel.findById(id, { _id: 1, name: 1, phone: 1, email: 1 }).orFail(() => {
    throw new NotFoundError('User not found')
  })
}

const getAllUsers = async (page, size) => {
  const users = UserModel.aggregate([
    { $match: { deleted_at: null } },
    { $skip: (page - 1) * size },
    { $limit: size },
    {
      $project: {
        _id: 1,
        username: 1,
        name: 1,
        phone: 1,
        email: 1
      }
    }
  ])
  const total = UserModel.countDocuments({ deleted_at: null })
  return { data: users, info: { total, page, size, number_of_pages: Math.ceil(total / size) } }
}

const deleteUser = async (id) => {
  return await UserModel.findByIdAndUpdate(Types.ObjectId.createFromHexString(id), { deleted_at: Date.now() })
}

const resetPassword = async (code, newPassword) => {
  jwt.verify(code, 'secret', async (err, decoded) => {
    if (err || !decoded) {
      throw new BadRequestError('Invalid access')
    } else {
      const result = await this.checkKey(decoded.data)
      if (result.length === 0) {
        throw new NotFoundError('User not found')
      }

      const hashedPassword = createHash(newPassword + result[0].salt)

      return await UserModel.findByIdAndUpdate(result[0]._id, { password: hashedPassword, updated_at: Date.now() })
    }
  })
}

const findUsersByAnyField = async (searchTerm, page, size) => {
  const users = UserModel.aggregate([
    {
      $match: {
        $and: [
          { deleted_at: null },
          {
            $or: [
              { _id: Types.ObjectId.createFromHexString(searchTerm) },
              { username: { $regex: searchTerm, $options: 'i' } },
              { email: { $regex: searchTerm, $options: 'i' } },
              { phone: { $regex: searchTerm, $options: 'i' } },
              { name: { $regex: searchTerm, $options: 'i' } }
            ]
          }
        ]
      }
    },
    { $skip: (page - 1) * size },
    { $limit: size },
    {
      $project: {
        _id: 1,
        username: 1,
        email: 1,
        phone: 1,
        name: 1
      }
    }
  ])
  const total = UserModel.countDocuments({
    $match: {
      $and: [
        { deleted_at: null },
        {
          $or: [
            { _id: Types.ObjectId.createFromHexString(searchTerm) },
            { username: { $regex: searchTerm, $options: 'i' } },
            { email: { $regex: searchTerm, $options: 'i' } },
            { phone: { $regex: searchTerm, $options: 'i' } },
            { name: { $regex: searchTerm, $options: 'i' } }
          ]
        }
      ]
    }
  })
  return { data: users, info: { total, page, size, number_of_pages: Math.ceil(total / size) } }
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
