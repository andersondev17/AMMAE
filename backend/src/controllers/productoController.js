const ProductoRepository = require('../repositories/productoRepository');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');

class ProductoController {
    constructor() {
        this.repository = new ProductoRepository();
    }

    getAllProductos = asyncHandler(async (req, res, next) => {

        const { productos, total, pagination } = await this.repository.getAllProductos(req.query);

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
        try {
            // Validación inicial de datos requeridos
            const {
                nombre,
                descripcion,
                precio,
                categoria,
                tallas,
                stock
            } = req.body;

            if (!nombre || !descripcion || !precio || !categoria) {
                return next(new ErrorResponse('Faltan campos requeridos', 400));
            }

            // Validación de tipo de datos y formato
            if (typeof precio !== 'number' || precio <= 0) {
                return next(new ErrorResponse('El precio debe ser un número válido mayor a 0', 400));
            }

            if (!Array.isArray(tallas)) {
                return next(new ErrorResponse('Las tallas deben ser un array', 400));
            }

            // Preparar datos para crear el producto
            const productoData = {
                nombre: nombre.trim(),
                descripcion: descripcion.trim(),
                precio: Number(precio),
                categoria,
                tallas: Array.isArray(tallas) ? tallas : [],
                colores: req.body.colores || [],
                stock: Number(stock),
                enOferta: Boolean(req.body.enOferta),
                precioOferta: req.body.enOferta ? Number(req.body.precioOferta) : undefined,
                estilo: req.body.estilo?.trim(),
                material: req.body.material?.trim(),
                imagenes: req.body.imagenes || []
            };

            // Crear el producto usando el repositorio
            const producto = await this.repository.createProducto(productoData);

            // Enviar respuesta exitosa
            res.status(201).json({
                success: true,
                data: producto,
                message: 'Producto creado exitosamente'
            });

        } catch (error) {
            console.error('Error al crear producto:', error);
            next(new ErrorResponse(error.message || 'Error al crear el producto', 500));
        }
    });

    // productoController.js

    actualizarProducto = asyncHandler(async (req, res, next) => {
        try {
            const { id } = req.params;

            // Validar que el producto existe
            const productoExistente = await this.repository.getProductoById(id);
            if (!productoExistente) {
                return next(new ErrorResponse(`Producto no encontrado con id ${id}`, 404));
            }

            // Preparar datos de actualización
            const updateData = {
                ...req.body,
                updatedAt: Date.now()
            };

            // Validaciones específicas para actualización
            if (updateData.precio) {
                updateData.precio = Number(updateData.precio);
            }
            if (updateData.stock) {
                updateData.stock = Number(updateData.stock);
            }
            if (updateData.precioOferta && updateData.enOferta) {
                updateData.precioOferta = Number(updateData.precioOferta);
            }

            // Actualizar producto
            const productoActualizado = await this.repository.updateProducto(id, updateData);

            res.status(200).json({
                success: true,
                data: productoActualizado,
                message: 'Producto actualizado exitosamente'
            });

        } catch (error) {
            console.error('Error al actualizar producto:', error);
            next(new ErrorResponse(error.message || 'Error al actualizar el producto', 500));
        }
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