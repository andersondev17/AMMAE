const Producto = require('../models/productos');
const ApiFeatures = require('../utils/apiFeatures');

class ProductoRepository {
    async getAllProductos(queryString) {
        console.log('Query string:', queryString);
        const features = new ApiFeatures(Producto.find(), queryString)
            .filter()
            .sort()
            .limitFields()
            .paginate()
            .search();
    
        console.log('Filtered query:', features.query.getFilter());
    
        const productos = await features.query;
        const total = await Producto.countDocuments(features.query.getFilter());
    
        console.log('Productos encontrados:', productos);
        console.log('Total de productos:', total);
    
        return {
            productos,
            total,
            pagination: features.pagination
        };
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