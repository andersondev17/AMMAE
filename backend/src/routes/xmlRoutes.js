// src/routes/xmlRoutes.js
const express = require('express');
const router = express.Router();
const { 
    getXMLAnalytics, 
    refreshXMLAnalytics 
} = require('../controllers/xmlController');

router.get('/xml', getXMLAnalytics);

router.post('/xml/refresh', refreshXMLAnalytics);

module.exports = router;