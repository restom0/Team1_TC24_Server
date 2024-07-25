import { requireApiKey } from '../middlewares/useApiKey.middleware.js'
import { LogRouter } from './log.route.js'
import MenuRouter from './menu.route.js'
import { OrderRouter } from './order.route.js'
import { RestaurantRouter } from './restaurant.route.js'
import { TableRouter } from './table.route.js'
import { UserRouter } from './user.route.js'

const route = (app) => {
  app.use('/logs', requireApiKey, LogRouter)

  app.use('/restaurants', RestaurantRouter)

  app.use('/tables', TableRouter)

  app.use('/orders', OrderRouter)

  app.use('/menus', MenuRouter)

  app.use('/', UserRouter)
}

export default route
