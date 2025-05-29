// src/controllers/dashboardController.js
const Order = require('../models/Order');
const Producto = require('../models/productos');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

exports.getRecentOrders = asyncHandler(async (req, res) => {
    const limit = Math.min(parseInt(req.query.limit) || 5, 20);

    const results = await Order.find()
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean()//consultas de solo lectura
        .catch(error => {
            logger.error('Order query failed', { error, query: req.query });
            throw new Error('Error retrieving orders');
        });
    res.json({
        success: true,
        count: results.length,
        data: results
    });
});
// Resumen del dashboard
exports.getDashboardSummary = asyncHandler(async (req, res) => {
    try {
        const [totalOrders, totalProductos, enStock] = await Promise.all([
            Order.countDocuments(),
            Producto.countDocuments(),
            Producto.countDocuments({ stock: { $gt: 0 } })
        ]);

        const orders = await Order.find().select('totalPagado customerData.email');

        const ingresos = orders.reduce((sum, order) => sum + (order.totalPagado || 0), 0);

        const clientesUnicos = new Set(
            orders
                .map(order => order.customerData?.email)
                .filter(email => email)
        ).size;

        res.status(200).json({
            success: true,
            data: {
                ingresos,
                totalPedidos: totalOrders,
                clientesUnicos,
                productosTotal: totalProductos,
                productosEnStock: enStock
            }
        });
    } catch (error) {
        console.error('Error en dashboard summary:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener resumen del dashboard'
        });
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
exports.getOrders = asyncHandler(async (req, res, next) => {
    try {
        // Extraer parámetros de consulta
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Consultar órdenes con paginación
        const orders = await Order.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Order.countDocuments();

        // Responder con éxito
        res.status(200).json({
            success: true,
            count: orders.length,
            total,
            pagination: {
                page,
                pages: Math.ceil(total / limit)
            },
            data: orders
        });
    } catch (error) {
        console.error('Error obteniendo órdenes:', error);
        next(new ErrorResponse('Error al obtener órdenes', 500));
    }
});

//futuro reporte 
exports.generateReport = asyncHandler(async (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Funcionalidad de generación de reportes en desarrollo'
    });
});