import { LogModel } from '../models/logs.model.js'

const getDataOnDate = async (date, id) => {
  const start = new Date(date)
  start.setUTCDate(start.getUTCDate())
  start.setUTCHours(0, 0, 0, 0)
  const end = new Date(date)
  end.setUTCHours(23, 59, 59, 999)
  console.log(new Date(date), start, end)
  return await LogModel.find({
    userID: id,
    date: {
      $gte: start,
      $lte: end
    }
  }).exec()
}
const createLog = async (data) => {
  return await LogModel.create(data)
}
export const LogService = {
  getDataOnDate,
  createLog
}
