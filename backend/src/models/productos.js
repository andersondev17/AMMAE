const mongoose = require('mongoose');

class ProductoFactory {
    createSchema() {
        return new mongoose.Schema({
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
                enum: ['Jeans', 'Blusas', 'Vestidos', 'Faldas', 'Accesorios', 'Camisetas']
            },
            tallas: [{
                type: String,
                enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL']
            }],
            colores: [String],
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
    }

    createModel() {
        const ProductoSchema = this.createSchema();
        
        // Middleware pre-save
        ProductoSchema.pre('save', function(next) {
            this.updatedAt = Date.now();
            next();
        });

        // Método estático para búsqueda avanzada
        ProductoSchema.statics.busquedaAvanzada = function(criterios) {
            return this.find(criterios);
        };

        // Método de instancia para calcular descuento
        ProductoSchema.methods.calcularDescuento = function() {
            if (this.enOferta && this.precioOferta) {
                return ((this.precio - this.precioOferta) / this.precio) * 100;
            }
            return 0;
        };

        return mongoose.model('Producto', ProductoSchema);
    }
}

module.exports = new ProductoFactory().createModel();