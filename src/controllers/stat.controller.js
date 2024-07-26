import { UserService } from '../services/user.service.js'

const countUsers = async (req, res) => {
  // #swagger.tags=['Stat']
  try {
    const data = await UserService.countUsers()
    return new Response(200, 'success', data).resposeHandler(res)
  } catch (error) {
    return new Response(error.statusCode, error.message, null).resposeHandler(res)
  }
}

export const StatController = {
  countUsers
}
