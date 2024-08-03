import { Response } from '../dto/response/response.js'
import { BadRequestError } from '../errors/badRequest.error.js'
import { TableService } from '../services/table.service.js'
import { CommonUtils } from '../utils/common.util.js'

const getAllTable = async (req, res, next) => {
  // #swagger.tags=['Table']
  try {
    const { page, size } = req.query
    const data = await TableService.getAllTable(page, size)
    next(new Response(200, 'Thành Công', data.data, data.info)).resposeHandler(res)
  } catch (error) {
    next(new Response(error.statusCode || 500, error.message, null).resposeHandler(res))
  }
}

const getTableById = async (req, res, next) => {
  // #swagger.tags=['Table']
  try {
    const id = req.params.id
    const data = await TableService.getTableById(id)
    next(new Response(200, 'Thành Công', data).resposeHandler(res))
  } catch (error) {
    next(new Response(error.statusCode || 500, error.message, null).resposeHandler(res))
  }
}

const createTable = async (req, res, next) => {
  // #swagger.tags=['Table']
  try {
    const result = await TableService.createTable(req.body)
    next(new Response(201, 'Thành Công', result).resposeHandler(res))
  } catch (error) {
    next(new Response(error.statusCode || 500, error.message, error).resposeHandler(res))
  }
}

const updateTable = async (req, res, next) => {
  // #swagger.tags=['Table']
  try {
    const result = await TableService.updateTable(req.params.id, req.body)
    next(new Response(200, 'Thành Công', result).resposeHandler(res))
  } catch (error) {
    next(new Response(error.statusCode || 500, error.message, null).resposeHandler(res))
  }
}

const deleteTable = async (req, res, next) => {
  // #swagger.tags=['Table']
  try {
    const result = await TableService.deleteTable(req.params.id)
    next(new Response(200, 'Thành Công', result).resposeHandler(res))
  } catch (error) {
    next(new Response(error.statusCode || 500, error.message, null).resposeHandler(res))
  }
}
const findTableByAnyField = async (req, res, next) => {
  try {
    const { searchTerm } = req.body
    const { page, size } = req.query
    const result = await TableService.findTablesByAnyField(searchTerm, page, size)
    next(new Response(200, 'Đã tìm thấy bàn', result.data, result.info).resposeHandler(res))
  } catch (error) {
    next(new Response(error.statusCode || 500, error.message, null).resposeHandler(res))
  }
}

export const TableController = {
  getAllTable,
  getTableById,
  createTable,
  updateTable,
  deleteTable,
  findTableByAnyField
}
