import { HttpStatusCode } from 'axios'
import { Response } from '../dto/response/response.js'
import { LogService } from '../services/log.service.js'

const getDataOnDate = async (req, res, next) => {
  // #swagger.tags=['Log']
  try {
    const { date } = req.query
    const data = await LogService.getDataOnDate(date, req.user.id)
    return new Response(HttpStatusCode.Ok, 'Success', data).resposeHandler(res)
  } catch (error) {
    return new Response(error.statusCode, error.message, error).resposeHandler(res)
  }
}

export const LogController = {
  getDataOnDate
}
