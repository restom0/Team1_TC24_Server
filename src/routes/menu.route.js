import express from 'express'
import { MenuController } from '../controllers/menu.controller.js'
import { validateMenuItem } from '../dto/in/menu.dto.js'
import { handleValidationErrors } from '../middlewares/validation.middleware.js'
import { authenticationAdmin, requireApiKey } from '../middlewares/useApiKey.middleware.js'
const MenuRouter = express.Router()
MenuRouter.post(
  '/',
  requireApiKey,
  authenticationAdmin,
  validateMenuItem,
  handleValidationErrors,
  MenuController.createMenuItem
)
MenuRouter.get('/', handleValidationErrors, MenuController.getAllMenuItems)
MenuRouter.get('/menu/:id', handleValidationErrors, MenuController.getMenuItemById)
MenuRouter.put('/menu/:id', requireApiKey, authenticationAdmin, validateMenuItem, handleValidationErrors, MenuController.updateMenuItemById)
MenuRouter.delete('/menu/:id',, requireApiKey, authenticationAdmin, handleValidationErrors, MenuController.deleteMenuItemById)
MenuRouter.post('/find-menu', MenuController.findMenuByAnyField)
MenuRouter.get('/total-menu', requireApiKey, authenticationAdmin, MenuController.countMenu)
export default MenuRouter
