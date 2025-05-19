// src/routes/dashboardRoutes.js
const express = require('express');
const router = express.Router();
const { 
    getRecentOrders,
    getDashboardSummary,
    generateReport  
} = require('../controllers/dashboardController');
const { protect } = require('../middleware/auth');

// Rutas principales
router.get('/recent-orders', getRecentOrders);
router.get('/summary', getDashboardSummary);  

router.post('/reports/generate', protect, generateReport);

module.exports = router;