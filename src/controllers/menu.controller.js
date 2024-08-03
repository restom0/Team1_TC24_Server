import { Response } from '../dto/response/response.js'
import { MenuService } from '../services/menus.service.js'
import { BadRequestError } from '../errors/badRequest.error.js'
const createMenuItem = async (req, res, next) => {
  try {
    const newItem = await MenuService.createMenuItem(req.body)
    next(new Response(201, 'Menu đã được tạo', newItem).resposeHandler(res))
  } catch (error) {
    next(new Response(error.statusCode || 500, error.message, null).resposeHandler(res))
  }
}

const getAllMenuItems = async (req, res, next) => {
  try {
    const { page, size } = req.query
    const items = await MenuService.getAllMenuItems(page, size)
    next(new Response(200, 'Thành Công', items.data, items.info).resposeHandler(res))
  } catch (error) {
    next(new Response(error.statusCode || 500, error.message, null).resposeHandler(res))
  }
}

const getMenuItemById = async (req, res, next) => {
  try {
    const item = await MenuService.getMenuItemById(req.params.id)
    next(new Response(200, 'Thành Công', item).resposeHandler(res))
  } catch (error) {
    next(new Response(error.statusCode || 500, error.message, null).resposeHandler(res))
  }
}

const updateMenuItemById = async (req, res, next) => {
  try {
    const item = await MenuService.updateMenuItemById(req.params.id, req.body)
    next(new Response(200, 'Menu đã được cập nhật', item).resposeHandler(res))
  } catch (error) {
    next(new Response(error.statusCode || 500, error.message, null).resposeHandler(res))
  }
}

const deleteMenuItemById = async (req, res, next) => {
  try {
    await MenuService.deleteMenuItemById(req.params.id)
    next(new Response(200, 'Menu đã được xóa', null).resposeHandler(res))
  } catch (error) {
    next(new Response(error.statusCode || 500, error.message, null).resposeHandler(res))
  }
}

const findMenuByAnyField = async (req, res, next) => {
  try {
    const { searchTerm } = req.body
    const { page, size } = req.query
    const result = await MenuService.findMenuItemsByAnyField(searchTerm, page, size)
    next(new Response(200, 'Đã tìm thấy bàn', result).resposeHandler(res))
  } catch (error) {
    next(new Response(error.statusCode || 500, error.message, null).resposeHandler(res))
  }
}
const countMenu = async (req, res, next) => {
  try {
    const result = await MenuService.countMenu()
    next(new Response(200, 'Thành Công', result).resposeHandler(res))
  } catch (error) {
    next(new Response(error.statusCode || 500, error.message, null).resposeHandler(res))
  }
}

export const MenuController = {
  createMenuItem,
  getAllMenuItems,
  getMenuItemById,
  updateMenuItemById,
  deleteMenuItemById,
  findMenuByAnyField,
  countMenu
}
