const ProductoRepository = require('../repositories/productoRepository');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');

class ProductoController {
    constructor() {
        this.repository = new ProductoRepository();
    }

    getAllProductos = asyncHandler(async (req, res, next) => {
        console.log('Query params:', req.query);
        const { productos, total, pagination } = await this.repository.getAllProductos(req.query);
        console.log('Productos recuperados:', productos);
        console.log('Total de productos:', total);
        res.status(200).json({
            success: true,
            count: productos.length,
            pagination,
            data: productos
        });
    });

    getProducto = asyncHandler(async (req, res, next) => {
        const producto = await this.repository.getProductoById(req.params.id);
        if (!producto) {
            return next(new ErrorResponse(`Producto no encontrado con id ${req.params.id}`, 404));
        }
        res.status(200).json({
            success: true,
            data: producto
        });
    });

    crearProducto = asyncHandler(async (req, res, next) => {
        const producto = await this.repository.createProducto(req.body);
        res.status(201).json({
            success: true,
            data: producto
        });
    });

    actualizarProducto = asyncHandler(async (req, res, next) => {
        const producto = await this.repository.updateProducto(req.params.id, req.body);
        if (!producto) {
            return next(new ErrorResponse(`Producto no encontrado con id ${req.params.id}`, 404));
        }
        res.status(200).json({
            success: true,
            data: producto
        });
    });

    eliminarProducto = asyncHandler(async (req, res, next) => {
        const producto = await this.repository.deleteProducto(req.params.id);
        if (!producto) {
            return next(new ErrorResponse(`Producto no encontrado con id ${req.params.id}`, 404));
        }
        res.status(200).json({
            success: true,
            data: {}
        });
    });

    getProductosPorCategoria = asyncHandler(async (req, res, next) => {
        const productos = await this.repository.getProductosByCategoria(req.params.categoria);
        res.status(200).json({
            success: true,
            count: productos.length,
            data: productos
        });
    });

    getProductosEnOferta = asyncHandler(async (req, res, next) => {
        const productos = await this.repository.getProductosEnOferta();
        res.status(200).json({
            success: true,
            count: productos.length,
            data: productos
        });
    });
}

module.exports = new ProductoController();