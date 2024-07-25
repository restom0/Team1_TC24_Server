import express from 'express'
import { UserController } from '../controllers/user.controller.js'
import { UserLoginValidation, UserRegisterValidation } from '../dto/in/user.dto.js'
import { handleValidationErrors } from '../middlewares/validation.middleware.js'
const UserRouter = express.Router()

/**
 * @swagger
 * tags:
 *  name: User
 *  description: User management
 * /login:
 *   post:
 *     tags:
 *       - User
 *     summary: Login
 *     description: Login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: Username
 *               password:
 *                 type: string
 *                 description: Password
 * /resgister:
 *   post:
 *     tags:
 *       - User
 *     summary: Register
 *     description: Register
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: Username
 *               password:
 *                 type: string
 *                 description: Password
 *               phone:
 *                type: string
 *                description: Phone
 *               email:
 *                type: string
 *                description: Email
 */

UserRouter.post('/login', UserLoginValidation, handleValidationErrors, UserController.login)
UserRouter.post('/register', UserRegisterValidation, handleValidationErrors, UserController.register)
export { UserRouter }
