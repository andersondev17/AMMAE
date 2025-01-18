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

router.route('/')
    .post(createOrder)
    .get(getOrders);

router.route('/:id')
    .get(getOrder);

router.route('/:id/status')
    .patch(updateOrderStatus);

router.route('/confirm-payment')
    .post(confirmPayment);

module.exports = router;