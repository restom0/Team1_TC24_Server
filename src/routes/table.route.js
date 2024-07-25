import express from 'express'
import { TableController } from '../controllers/table.controller.js'
const TableRouter = express.Router()

TableRouter.get('/', TableController.getAllTable)
TableRouter.get('/:id', TableController.getTableById)
TableRouter.post('/', TableController.createTable)
TableRouter.put('/:id', TableController.updateTable)
TableRouter.delete('/:id', TableController.deleteTable)

export { TableRouter }
