import express from 'express'
import { UserController } from '../controllers/user.controller.js'
import { UserLoginValidation, UserRegisterValidation } from '../dto/in/user.dto.js'
import { handleValidationErrors } from '../middlewares/validation.middleware.js'
const UserRouter = express.Router()

UserRouter.post('/login', UserLoginValidation, handleValidationErrors, UserController.login)
UserRouter.post('/register', UserRegisterValidation, handleValidationErrors, UserController.register)
UserRouter.post('/registerStaff', UserRegisterValidation, handleValidationErrors, UserController.registerStaff)
UserRouter.get('/:id', UserController.getUserById)
UserRouter.get('/', UserController.getAllUsers)
UserRouter.delete('/:id', UserController.deleteUser)
export { UserRouter }
