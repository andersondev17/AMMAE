// routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const {
    createOrder,
    getOrders,
    getOrder,
    updateOrderStatus,
    confirmPayment
} = require('../controllers/orderController');

router.post('/', createOrder);

router.route('/:id')
    .get(getOrder);

router.get('/:orderNumber')
    .get(getOrder)
    .patch(updateOrderStatus);
    
router.patch('/:orderNumber/status', updateOrderStatus);

router.route('/:id/status')
    .patch(updateOrderStatus);


module.exports = router;