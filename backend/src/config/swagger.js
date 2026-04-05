const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Real Time Chat API',
      version: '1.0.0',
      description: 'Backend API docs for the real time chat learning project',
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        LoginRequest: {
          type: 'object',
          required: ['identifier', 'password'],
          properties: {
            identifier: {
              type: 'string',
              example: 'ben',
            },
            password: {
              type: 'string',
              example: 'password123',
            },
          },
        },
        LoginResponse: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              example: 'Login successful',
            },
            token: {
              type: 'string',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
            },
            user: {
              $ref: '#/components/schemas/User',
            },
          },
        },
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: '1',
            },
            username: {
              type: 'string',
              example: 'ben',
            },
            email: {
              type: 'string',
              example: 'ben@example.com',
            },
          },
        },
        HealthResponse: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              example: 'ok',
            },
          },
        },
      },
    },
    paths: {
      '/': {
        get: {
          summary: 'Root endpoint',
          responses: {
            200: {
              description: 'API status message',
            },
          },
        },
      },
      '/health': {
        get: {
          summary: 'Health check',
          responses: {
            200: {
              description: 'Backend is healthy',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/HealthResponse',
                  },
                },
              },
            },
          },
        },
      },
      '/auth/login': {
        post: {
          summary: 'Login with username or email and password',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/LoginRequest',
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Login succeeded',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/LoginResponse',
                  },
                },
              },
            },
            400: {
              description: 'Missing identifier or password',
            },
            401: {
              description: 'Invalid credentials',
            },
          },
        },
      },
      '/auth/me': {
        get: {
          summary: 'Get current authenticated user',
          security: [
            {
              bearerAuth: [],
            },
          ],
          responses: {
            200: {
              description: 'Authenticated user',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      user: {
                        $ref: '#/components/schemas/User',
                      },
                    },
                  },
                },
              },
            },
            401: {
              description: 'Missing, invalid, or expired token',
            },
          },
        },
      },
    },
  },
  apis: [],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
