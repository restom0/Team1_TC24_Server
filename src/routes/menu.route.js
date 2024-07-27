import express from 'express'
import { MenuController } from '../controllers/menu.controller.js'
import { validateMenuItem } from '../dto/in/menu.dto.js'
import { handleValidationErrors } from '../middlewares/validation.middleware.js'
const MenuRouter = express.Router()
MenuRouter.post('/', validateMenuItem, handleValidationErrors, MenuController.createMenuItem)
MenuRouter.get('/', handleValidationErrors, MenuController.getAllMenuItems)
MenuRouter.get('/:id', handleValidationErrors, MenuController.getMenuItemById)
MenuRouter.put('/:id', validateMenuItem, handleValidationErrors, MenuController.updateMenuItemById)
MenuRouter.delete('/:id', handleValidationErrors, MenuController.deleteMenuItemById)
MenuRouter.post('/find-menu', MenuController.findMenuByAnyField)
export default MenuRouter
