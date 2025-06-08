// models/productos.js - VERSIÓN LIMPIA
const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre del producto es obligatorio'],
        trim: true,
        maxlength: [100, 'El nombre no puede tener más de 100 caracteres']
    },
    descripcion: {
        type: String,
        required: [true, 'La descripción del producto es obligatoria'],
        trim: true
    },
    precio: {
        type: Number,
        required: [true, 'El precio del producto es obligatorio'],
        min: [0, 'El precio no puede ser negativo']
    },
    categoria: {
        type: String,
        required: [true, 'La categoría es obligatoria'],
        enum: ['Jeans', 'Blusas', 'Vestidos', 'Faldas', 'Accesorios']
    },
    tallas: [{
        type: String,
        enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL']
    }],
    colores: [String],
    // SOLUCIÓN: Almacenar solo nombres de archivo SIMPLES
    imagenes: [{
        type: String,
        required: [true, 'Al menos una imagen del producto es obligatoria']
    }],
    stock: {
        type: Number,
        required: [true, 'El stock del producto es obligatorio'],
        min: [0, 'El stock no puede ser negativo']
    },
    enOferta: {
        type: Boolean,
        default: false
    },
    precioOferta: {
        type: Number,
        validate: {
            validator: function(value) {
                return !this.enOferta || value < this.precio;
            },
            message: 'El precio de oferta debe ser menor que el precio regular'
        }
    },
    estilo: String,
    material: String
}, {
    timestamps: true
});

// MIDDLEWARE SIMPLIFICADO - Solo limpiar nombres
productoSchema.pre('save', function(next) {
    if (this.imagenes && Array.isArray(this.imagenes)) {
        this.imagenes = this.imagenes.map(img => {
            if (!img) return '';
            
            return img
                .replace(/^.*\//, '') // Remover cualquier ruta
                .replace(/^assets\/images\/demo\//, '') // Limpiar prefijos
                .trim();
        }).filter(Boolean);
    }
    next();
});

module.exports = mongoose.model('Producto', productoSchema);