// controllers/orderController.js
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
            costoEnvio,
            direccionEnvio
        } = req.body;

        // Generar número de orden único
        const orderNumber = `ORD${Date.now()}${Math.floor(Math.random() * 1000)}`;

        const order = await Order.create({
            orderNumber,
            customerData,
            productos,
            metodoPago,
            totalPagado,
            costoEnvio,
            direccionEnvio,
            estado: 'pendiente'
        });

        // Popular los datos de productos para la respuesta
        await order.populate('productos.producto');

        res.status(201).json({
            success: true,
            data: order
        });

    } catch (error) {
        console.error('Error al crear orden:', error);
        return next(new ErrorResponse('Error al procesar el pedido', 500));
    }
});

exports.getOrder = asyncHandler(async (req, res, next) => {
    const { orderNumber } = req.params;

    const order = await Order.findOne({ orderNumber })
        .populate('productos.producto');

    if (!order) {
        return next(new ErrorResponse('Pedido no encontrado', 404));
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