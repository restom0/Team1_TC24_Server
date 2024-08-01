import { Response } from '../dto/response/response.js'
import { BadRequestError } from '../errors/badRequest.error.js'
import { TableService } from '../services/table.service.js'
import { CommonUtils } from '../utils/common.util.js'

const getAllTable = async (req, res, next) => {
  // #swagger.tags=['Table']
  try {
    let data
    if (req.query.upper && req.query.lower && req.query.sort) {
      const { upper, lower, sort, page } = req.query
      data = await TableService.getAllTableByFilterAndSort(upper, lower, sort, page)
    } else {
      data = await TableService.getAllTable()
    }
    return new Response(200, 'Thành Công', { content: data, numPage: Math.ceil(data.length / 8) }).resposeHandler(res)
  } catch (error) {
    return new Response(error.statusCode || 500, error.message, null).resposeHandler(res)
  }
}

const getTableById = async (req, res, next) => {
  // #swagger.tags=['Table']
  try {
    const id = req.params.id
    const data = await TableService.getTableById(id)
    return new Response(200, 'Thành Công', data).resposeHandler(res)
  } catch (error) {
    return new Response(error.statusCode || 500, error.message, null).resposeHandler(res)
  }
}

const createTable = async (req, res, next) => {
  // #swagger.tags=['Table']
  try {
    const data = req.body
    if (CommonUtils.checkNullOrUndefined(data)) {
      throw new BadRequestError('Dữ liệu là bắt buộc')
    }
    const result = await TableService.createTable(data)
    console.log(result)
    return new Response(201, 'Thành Công', result).resposeHandler(res)
  } catch (error) {
    if (!res.headersSent) {
      return new Response(error.statusCode || 500, error.message, null).resposeHandler(res)
    }
    next(error)
  }
}

const updateTable = async (req, res) => {
  // #swagger.tags=['Table']
  try {
    const id = req.params.id
    const data = req.body
    if (CommonUtils.checkNullOrUndefined(data)) {
      throw new BadRequestError('Dữ liệu là bắt buộc')
    }
    const result = await TableService.updateTable(id, data)
    return new Response(200, 'Thành Công', result).resposeHandler(res)
  } catch (error) {
    return new Response(error.statusCode || 500, error.message, null).resposeHandler(res)
  }
}

const deleteTable = async (req, res) => {
  // #swagger.tags=['Table']
  try {
    const id = req.params.id
    const result = await TableService.deleteTable(id)
    res.json(result)
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message })
  }
}
const findTableByAnyField = async (req, res, next) => {
  try {
    const { searchTerm } = req.body
    if (!searchTerm) {
      throw new BadRequestError('Giá trị tìm kiếm là bắt buộc')
    }
    const result = await TableService.findTablesByAnyField(searchTerm)
    if (result.length === 0) {
      return new Response(404, 'Không tìm thấy bàn', null).resposeHandler(res)
    }
    return new Response(200, 'Đã tìm thấy bàn', result).resposeHandler(res)
  } catch (error) {
    return new Response(error.statusCode || 500, error.message, null).resposeHandler(res)
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
