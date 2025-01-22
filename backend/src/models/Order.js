// models/Order.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    orderNumber: {
        type: String,
        required: true,
        unique: true
    },
    customerData: {
        nombre: {
            type: String,
            required: [true, 'El nombre es requerido']
        },
        email: {
            type: String,
            required: [true, 'El email es requerido']
        },
        telefono: {
            type: String,
            required: [true, 'El teléfono es requerido']
        }
    },
    productos: [{
        producto: {
            type: mongoose.Schema.ObjectId,
            ref: 'Producto',
            required: true
        },
        cantidad: {
            type: Number,
            required: true,
            min: [1, 'La cantidad debe ser al menos 1']
        },
        talla: String,
        color: String,
        precioUnitario: Number
    }],
    estado: {
        type: String,
        enum: ['pendiente', 'procesando', 'enviado', 'entregado', 'cancelado'],
        default: 'pendiente'
    },
    metodoPago: {
        type: String,
        required: true,
        enum: ['contraentrega', 'transferencia', 'qr']
    },
    totalPagado: {
        type: Number,
        required: true
    },
    costoEnvio: {
        type: Number,
        required: true,
        default: 5000
    },
    direccionEnvio: {
        calle: String,
        ciudad: String,
        codigoPostal: String,
        pais: {
            type: String,
            default: 'Colombia'
        }
    },
    fechaPedido: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Método para generar número de orden único
orderSchema.statics.generateOrderNumber = function() {
    return `ORD${Date.now()}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
};

// Pre-save middleware para asignar número de orden
// Middleware para generar número de orden
orderSchema.pre('save', async function(next) {
    if (!this.orderNumber) {
        const date = new Date();
        const year = date.getFullYear().toString().slice(-2);
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        this.orderNumber = `AM${year}${month}-${random}`;
        console.log('📝 Número de orden generado:', this.orderNumber);
    }
    next();
});

// Índices
orderSchema.index({ orderNumber: 1 }, { unique: true });
orderSchema.index({ fechaPedido: -1 });
orderSchema.index({ 'customerData.email': 1 });

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;