const mongoose = require('mongoose');

const pedidoSchema = new mongoose.Schema({
    usuario: {
        type: mongoose.Schema.ObjectId,
        ref: 'Usuario',
        required: true
    },
    productos: [{
        producto: {
            type: mongoose.Schema.ObjectId,
            ref: 'Producto',
            required: true
        },
        cantidad: {
            type: Number,
            required: true
        },
        talla: String,
        color: String
    }],
    estado: {
        type: String,
        required: true,
        enum: ['pendiente', 'procesando', 'enviado', 'entregado', 'cancelado'],
        default: 'pendiente'
    },
    metodoPago: {
        type: String,
        required: true
    },
    totalPagado: {
        type: Number,
        required: true
    },
    fechaPedido: {
        type: Date,
        default: Date.now
    },
    direccionEnvio: {
        calle: String,
        ciudad: String,
        codigoPostal: String,
        pais: String
    }
});

const Pedido = mongoose.model('Pedido', pedidoSchema);

module.exports = Pedido;