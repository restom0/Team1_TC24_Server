import swaggerAutogen from 'swagger-autogen'

const doc = {
  info: {
    title: 'My API',
    description: 'Description'
  },
  host: 'localhost:7000'
}

const outputFile = './swagger-output.json'
const routes = [
  './src/routes/log.route.js',
  './src/routes/restaurant.route.js',
  './src/routes/table.route.js',
  './src/routes/order.route.js',
  './src/routes/user.route.js',
  './src/routes/menu.route.js'
]

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the 
root file where the route starts, such as index.js, app.js, routes.js, etc ... */

swaggerAutogen()(outputFile, routes, doc)
