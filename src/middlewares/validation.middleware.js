import { HttpStatusCode } from 'axios'
import { validationResult } from 'express-validator'
import { Response } from '../dto/response/response.js'

export const handleValidationErrors = async (req, res, next) => {
  console.log(req)
  const errors = validationResult(req)
  console.log(errors)
  if (!errors.isEmpty()) {
    new Response(HttpStatusCode.BadRequest, 'Validation error', errors.array()).resposeHandler(res)
  }
  next()
}
