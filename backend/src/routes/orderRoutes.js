// routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const {
    createOrder,
    getOrder,
    getOrders, // Importante: importar esta función del controlador
    updateOrderStatus
} = require('../controllers/orderController');

// Usar la función getOrders del controlador en lugar de definir lógica aquí
router.get('/', getOrders);

router.post('/', createOrder);

router.get('/:orderNumber', getOrder);

router.patch('/:orderNumber/status', updateOrderStatus);

module.exports = router;