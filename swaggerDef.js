const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0', // Specification (optional, defaults to swagger: '2.0')
    info: {
      title: 'Game Server API', // Title (required)
      version: '1.0.0', // Version (required)
      description: 'API endpoints for the game server'
    },
  },
  // Path to the API docs
  apis: ['./routes/**.js'],
};

// Initialize swagger-jsdoc -> returns validated swagger spec in json format
const swaggerSpec = swaggerJSDoc(options);

module.exports = {
  swaggerSpec: swaggerSpec,
};