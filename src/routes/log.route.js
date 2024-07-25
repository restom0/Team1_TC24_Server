import express from 'express'
import { LogController } from '../controllers/log.controller.js'
const LogRouter = express.Router()

LogRouter.get('/', LogController.getDataOnDate)
export { LogRouter }
