import { HttpStatusCode } from 'axios'
import { Response } from '../dto/response/response.js'
import { LogService } from '../services/log.service.js'

const getDataOnDate = async (req, res, next) => {
  try {
    const { date } = req.query
    const data = await LogService.getDataOnDate(date, req.user.id)
    Response(HttpStatusCode.Ok, 'Success', data).responseHandler(res)
  } catch (error) {
    Response(error.statusCode, error.message, error).responseHandler(res)
  }
}

export const LogController = {
  getDataOnDate
}
