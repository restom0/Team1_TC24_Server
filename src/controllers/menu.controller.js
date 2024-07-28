import { Response } from '../dto/response/response.js'
import { MenuService } from '../services/menus.service.js'
import { BadRequestError } from '../errors/badRequest.error.js'
const createMenuItem = async (req, res, next) => {
  try {
    const newItem = await MenuService.createMenuItem(req.body)
    return new Response(201, 'Menu đã được tạo', newItem).resposeHandler(res)
  } catch (error) {
    if (!res.headersSent) {
      return new Response(error.statusCode || 500, error.message, null).resposeHandler(res)
    }
    next(error)
  }
}

const getAllMenuItems = async (req, res) => {
  try {
    const items = await MenuService.getAllMenuItems()
    return new Response(200, 'Thành Công', items).resposeHandler(res)
  } catch (error) {
    return new Response(500, error.message, null).resposeHandler(res)
  }
}

const getMenuItemById = async (req, res) => {
  try {
    const item = await MenuService.getMenuItemById(req.params.id)
    return new Response(200, 'Thành Công', item).resposeHandler(res)
  } catch (error) {
    return new Response(error.message === 'Không tìm thấy menu' ? 404 : 500, error.message, null).resposeHandler(res)
  }
}

const updateMenuItemById = async (req, res, next) => {
  try {
    const item = await MenuService.updateMenuItemById(req.params.id, req.body)
    return new Response(200, 'Menu đã được cập nhật', item).resposeHandler(res)
  } catch (error) {
    if (!res.headersSent) {
      return new Response(error.statusCode || 500, error.message, null).resposeHandler(res)
    }
    next(error)
  }
}

const deleteMenuItemById = async (req, res) => {
  try {
    await MenuService.deleteMenuItemById(req.params.id)
    return new Response(200, 'Menu đã được xóa', null).resposeHandler(res)
  } catch (error) {
    return new Response(error.message === 'Không tìm thấy menu' ? 404 : 500, error.message, null).resposeHandler(res)
  }
}

const findMenuByAnyField = async (req, res, next) => {
  try {
    const { searchTerm } = req.body
    if (!searchTerm) {
      throw new BadRequestError('Giá trị tìm kiếm là bắt buộc')
    }
    const result = await MenuService.findMenuItemsByAnyField(searchTerm)
    if (result.length === 0) {
      return new Response(404, 'Không tìm thấy bàn', null).resposeHandler(res)
    }
    return new Response(200, 'Đã tìm thấy bàn', result).resposeHandler(res)
  } catch (error) {
    return new Response(error.statusCode || 500, error.message, null).resposeHandler(res)
  }
}
const countMenu = async (req, res, next) => {
  try {
    const result = await MenuService.countMenu()
    return new Response(200, 'Thành Công', result).resposeHandler(res)
  } catch (error) {
    if (!res.headersSent) {
      return new Response(error.statusCode || 500, error.message, null).resposeHandler(res)
    }
    next(error)
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
