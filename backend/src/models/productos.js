// models/productos.js
const mongoose = require('mongoose');

class ProductoFactory {
    createSchema() {
        const schema = new mongoose.Schema({
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
                required: [true, 'Al menos una imagen del producto es obligatoria'],
                get: function(imagen) {
                    if (!imagen) return '';
                    // Normalizar la ruta eliminando 'public' y asegurando el formato correcto
                    return imagen.replace(/^public\//, '/').replace(/^\/?assets/, '/assets');
                },
                set: function(imagen) {
                    if (!imagen) return '';
                    // Almacenar la ruta en formato consistente
                    return imagen.replace(/^public\/|^\//, '').replace(/^\/?assets/, 'assets');
                }
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
            timestamps: true,
            toJSON: { getters: true },
            toObject: { getters: true }
        });

        // Middleware pre-save para procesar las imágenes
        schema.pre('save', function(next) {
            if (this.imagenes) {
                this.imagenes = this.imagenes.map(img => {
                    if (!img) return '';
                    return img.replace(/^public\/|^\//, '').replace(/^\/?assets/, 'assets');
                }).filter(Boolean);
            }
            next();
        });

        // Método para obtener URLs completas de imágenes
        schema.methods.getImageUrls = function() {
            return this.imagenes.map(img => {
                if (!img) return '/assets/images/demo/default-product.jpg';
                return img.startsWith('/') ? img : `/assets/images/demo/${img}`;
            });
        };

        // Método para calcular descuento
        schema.methods.calcularDescuento = function() {
            if (this.enOferta && this.precioOferta) {
                return ((this.precio - this.precioOferta) / this.precio) * 100;
            }
            return 0;
        };

        // Método estático para búsqueda avanzada
        schema.statics.busquedaAvanzada = function(criterios) {
            return this.find(criterios);
        };

        return schema;
    }

    createModel() {
        const ProductoSchema = this.createSchema();
        return mongoose.model('Producto', ProductoSchema);
    }
}

// Exportar una única instancia del modelo
module.exports = new ProductoFactory().createModel();