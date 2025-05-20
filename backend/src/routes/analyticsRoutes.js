// src/routes/analyticsRoutes.js
const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');

router.post('/web-vitals', analyticsController.saveWebVitals);

module.exports = router;