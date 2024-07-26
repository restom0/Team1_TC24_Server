import swaggerAutogen from 'swagger-autogen'

const doc = {
  info: {
    version: '0.0.0', // by default: '1.0.0'
    title: 'Mindx Restaurant API', // by default: 'REST API'
    description: '' // by default: ''
  },
  host: 'team1-tc24-server.onrender.com', // by default: 'localhost:3000'
  basePath: '/', // by default: '/'
  servers: [
    {
      url: 'https://team1-tc24-server.onrender.com',
      description: '' // by default: ''
    }
    // { ... }
  ],
  schemes: ['https'], // by default: ['http']
  consumes: ['application/json'], // by default: ['application/json']
  produces: ['application/json'], // by default: ['application/json']
  tags: [
    // by default: empty Array
    {
      name: 'User',
      description: 'Endpoints'
    },
    {
      name: 'Menu',
      description: 'Endpoints'
    },
    {
      name: 'Order',
      description: 'Endpoints'
    },
    {
      name: 'Restaurant',
      description: 'Endpoints'
    },
    {
      name: 'Table',
      description: 'Endpoints'
    },
    {
      name: 'Log',
      description: 'Endpoints'
    }
    // { ... }
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    }
  }, // by default: empty object
  secutiryDefinitions: {
    Bearer: {
      type: 'apiKey',
      name: 'Authorization',
      in: 'header'
    }
  },
  definitions: {} // by default: empty object
}

const outputFile = './swagger-output.json'
const routes = [
  // './src/routes/log.route.js',
  // './src/routes/restaurant.route.js',
  // './src/routes/table.route.js',
  // './src/routes/order.route.js',
  // './src/routes/user.route.js',
  // './src/routes/menu.route.js'
  './src/routes/index.route.js'
]

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the 
root file where the route starts, such as index.js, app.js, routes.js, etc ... */

swaggerAutogen()(outputFile, routes, doc).then(async () => {
  await import('./server.js') // Your project's root file
})
