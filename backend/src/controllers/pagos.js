const Pedido = require('../models/Pedido');
const ErrorResponse = require('../utils/errorResponse');

// Función de pago simulado
const simularPago = (amount) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (amount <= 0) {
                reject(new Error('El monto debe ser mayor que cero'));
            } else {
                resolve({
                    id: 'sim_' + Math.random().toString(36).substr(2, 9),
                    amount: amount,
                    currency: 'usd',
                    status: 'succeeded'
                });
            }
        }, 1000); // Simulamos un retraso de 1 segundo
    });
};

exports.procesarPago = async (req, res, next) => {
    try {
        const { amount, pedidoId } = req.body;

        const pedido = await Pedido.findById(pedidoId);

        if (!pedido) {
            return next(new ErrorResponse('Pedido no encontrado', 404));
        }

        // Usar el pago simulado
        const charge = await simularPago(amount);

        pedido.estado = 'pagado';
        pedido.transaccionId = charge.id;
        await pedido.save();

        res.status(200).json({
            success: true,
            data: charge
        });
    } catch (error) {
        next(error);
    }
};