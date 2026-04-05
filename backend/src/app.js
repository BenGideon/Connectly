const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const authRoutes = require('./routes/auth.routes');
const homeController = require('./controllers/home.controller');
const healthRoutes = require('./routes/health.routes');

const app = express();

app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/', homeController.getApiStatus);

app.use(authRoutes);
app.use(healthRoutes);

module.exports = app;
