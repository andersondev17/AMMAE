const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { procesarPago } = require('../controllers/pagos');

router.post('/procesar', protect, procesarPago);

module.exports = router;