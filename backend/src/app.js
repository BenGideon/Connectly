const express = require('express');
const homeController = require('./controllers/home.controller');
const healthRoutes = require('./routes/health.routes');

const app = express();

app.use(express.json());

app.get('/', homeController.getApiStatus);

app.use(healthRoutes);

module.exports = app;
