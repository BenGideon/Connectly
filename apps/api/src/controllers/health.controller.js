const healthService = require('../services/health.service');

const getHealth = (req, res) => {
  const healthStatus = healthService.getHealthStatus();

  res.json(healthStatus);
};

module.exports = {
  getHealth,
};
