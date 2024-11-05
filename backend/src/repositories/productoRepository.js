const Producto = require('../models/productos');
const ApiFeatures = require('../utils/apiFeatures');

class ProductoRepository {
    async getAllProductos(queryString) {
        try {
            console.log('Repository - Recibiendo query:', queryString);

            const features = new ApiFeatures(Producto.find(), queryString)
                .filter()
                .sort()
                .paginate();

            // Ejecutar consulta y contar total
            const [productos, total] = await Promise.all([
                features.query.exec(),
                Producto.countDocuments(features.query.getQuery())
            ]);

            console.log('Repository - Productos encontrados:', productos.length);
            console.log('Repository - Total:', total);

            return {
                productos,
                total,
                pagination: {
                    ...features.pagination,
                    totalPages: Math.ceil(total / features.pagination.limit)
                }
            };
        } catch (error) {
            console.error('Repository - Error:', error);
            throw error;
        }
    }

    async getProductoById(id) {
        return await Producto.findById(id);
    }

    async createProducto(productoData) {
        return await Producto.create(productoData);
    }

    async updateProducto(id, productoData) {
        return await Producto.findByIdAndUpdate(id, productoData, {
            new: true,
            runValidators: true
        });
    }

    async deleteProducto(id) {
        return await Producto.findByIdAndDelete(id);
    }

    async getProductosByCategoria(categoria) {
        return await Producto.find({ categoria });
    }

    async getProductosEnOferta() {
        return await Producto.find({ enOferta: true });
    }
}

module.exports = ProductoRepository;