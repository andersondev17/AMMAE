const Carrito = require('../models/Carrito');
const Producto = require('../models/productos');
const ErrorResponse = require('../utils/errorResponse');

exports.getCarrito = async (req, res, next) => {
    try {
        let carrito = await Carrito.findOne({ usuario: req.usuario.id }).populate('items.producto');

        if (!carrito) {
            carrito = await Carrito.create({ usuario: req.usuario.id, items: [] });
        }

        res.status(200).json({
            success: true,
            data: carrito
        });
    } catch (error) {
        next(error);
    }
};

exports.addItemToCarrito = async (req, res, next) => {
    try {
        const { productoId, cantidad, talla, color } = req.body;

        const producto = await Producto.findById(productoId);
        if (!producto) {
            return next(new ErrorResponse(`No se encontró un producto con el id ${productoId}`, 404));
        }

        let carrito = await Carrito.findOne({ usuario: req.usuario.id });

        if (!carrito) {
            carrito = await Carrito.create({ usuario: req.usuario.id, items: [] });
        }

        const itemIndex = carrito.items.findIndex(item =>
            item.producto.toString() === productoId && item.talla === talla && item.color === color
        );

        if (itemIndex > -1) {
            carrito.items[itemIndex].cantidad += cantidad;
        } else {
            carrito.items.push({ producto: productoId, cantidad, talla, color });
        }

        await carrito.save();

        res.status(200).json({
            success: true,
            data: carrito
        });
    } catch (error) {
        next(error);
    }
};

exports.removeItemFromCarrito = async (req, res, next) => {
    try {
        const { itemId } = req.params;

        const carrito = await Carrito.findOne({ usuario: req.usuario.id });

        if (!carrito) {
            return next(new ErrorResponse('No se encontró el carrito', 404));
        }

        carrito.items = carrito.items.filter(item => item._id.toString() !== itemId);

        await carrito.save();

        res.status(200).json({
            success: true,
            data: carrito
        });
    } catch (error) {
        next(error);
    }
};

exports.updateCarritoItem = async (req, res, next) => {
    try {
        const { itemId } = req.params;
        const { cantidad } = req.body;

        const carrito = await Carrito.findOne({ usuario: req.usuario.id });

        if (!carrito) {
            return next(new ErrorResponse('No se encontró el carrito', 404));
        }

        const itemIndex = carrito.items.findIndex(item => item._id.toString() === itemId);

        if (itemIndex === -1) {
            return next(new ErrorResponse('No se encontró el item en el carrito', 404));
        }

        carrito.items[itemIndex].cantidad = cantidad;

        await carrito.save();

        res.status(200).json({
            success: true,
            data: carrito
        });
    } catch (error) {
        next(error);
    }
};