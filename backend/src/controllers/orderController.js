// controllers/orderController.js
const mongoose = require('mongoose');
const Order = require('../models/Order');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

exports.createOrder = asyncHandler(async (req, res, next) => {
    try {
        const {
            customerData,
            productos,
            metodoPago,
            totalPagado,
            direccionEnvio
        } = req.body;

        if (!customerData || !productos?.length) {
            throw new ErrorResponse('Datos de orden incompletos', 400);
        }

        const date = new Date();
        const orderNumber = `AM${date.getFullYear().toString().slice(-2)}${(date.getMonth() + 1).toString().padStart(2, '0')}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;

        const order = await Order.create({
            orderNumber,
            customerData,
            productos: productos.map(p => ({
                producto: p.producto,
                cantidad: p.cantidad,
                talla: p.talla || '',
                color: p.color || '',
                precioUnitario: Number(p.precioUnitario) || 0
            })),
            metodoPago: metodoPago.replace('_', ''),
            totalPagado: Number(totalPagado),
            costoEnvio: Number(req.body.costoEnvio) || 5000,
            direccionEnvio
        });

        const populatedOrder = await Order.findById(order._id)
            .populate('productos.producto');

        res.status(201).json({
            success: true,
            data: populatedOrder
        });

    } catch (error) {
        console.error('❌ Error creando orden:', error);
        next(error);
    }
});


exports.getOrder = asyncHandler(async (req, res, next) => {
    const order = await Order.findOne({ orderNumber: req.params.orderNumber })
        .populate('productos.producto');

    if (!order) {
        return next(new ErrorResponse('Orden no encontrada', 404));
    }

    res.status(200).json({
        success: true,
        data: order
    });
});

exports.updateOrderStatus = asyncHandler(async (req, res, next) => {
    const { orderNumber } = req.params;
    const { estado } = req.body;

    const order = await Order.findOneAndUpdate(
        { orderNumber },
        { estado },
        { new: true, runValidators: true }
    ).populate('productos.producto');

    if (!order) {
        return next(new ErrorResponse('Pedido no encontrado', 404));
    }

    res.status(200).json({
        success: true,
        data: order
    });
});