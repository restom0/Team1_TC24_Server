import express from 'express'
import { LogController } from '../controllers/log.controller.js'
const LogRouter = express.Router()
/**
 * @swagger
 * /logs:
 *  get:
 *   tags:
 *    - Log
 *   summary: Get log data
 *   description: Get log data
 *  responses:
 *   200:
 *   description: Success
 */
LogRouter.get('/', LogController.getDataOnDate)
export { LogRouter }
