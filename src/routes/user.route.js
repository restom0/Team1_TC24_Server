import express from 'express'
import { UserController } from '../controllers/user.controller.js'
import { UserGetAnyFieldValidation, UserLoginValidation, UserRegisterValidation } from '../dto/in/user.dto.js'
import { handleValidationErrors } from '../middlewares/validation.middleware.js'
import { requireApiKey } from '../middlewares/useApiKey.middleware.js'
const UserRouter = express.Router()

UserRouter.post('/login', UserLoginValidation, handleValidationErrors, UserController.loginUser)
UserRouter.post('/auth/login', UserLoginValidation, handleValidationErrors, UserController.loginAdmin)
UserRouter.post('/register', UserRegisterValidation, handleValidationErrors, UserController.register)
UserRouter.post('/mail', UserController.sendMail)
UserRouter.post('/staff/resgister', UserRegisterValidation, handleValidationErrors, UserController.registerStaff)
UserRouter.get('/user', requireApiKey, UserController.getUserById)
UserRouter.get('/', UserController.getAllUsers)
UserRouter.delete('/:id', UserController.deleteUser)
UserRouter.post('/mailrs', UserController.sendResetPasswordEmail)
UserRouter.put('/password', UserController.resetPassword)
UserRouter.post('/search', UserGetAnyFieldValidation, handleValidationErrors, UserController.findUsersByAnyField)
export default UserRouter
