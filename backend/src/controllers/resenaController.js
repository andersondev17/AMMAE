// src/controllers/resenaController.js
const Resena = require('../models/Resena');
const Producto = require('../models/productos');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');

exports.getResenas = asyncHandler(async (req, res, next) => {
    if (req.params.productoId) {
        const resenas = await Resena.find({ producto: req.params.productoId });
        return res.status(200).json({
            success: true,
            count: resenas.length,
            data: resenas
        });
    } else {
        res.status(200).json(res.advancedResults);
    }
});

exports.getResena = asyncHandler(async (req, res, next) => {
    const resena = await Resena.findById(req.params.id).populate({
        path: 'producto',
        select: 'nombre descripcion'
    });

    if (!resena) {
        return next(new ErrorResponse(`No se encontró reseña con el id de ${req.params.id}`, 404));
    }

    res.status(200).json({
        success: true,
        data: resena
    });
});

exports.createResena = asyncHandler(async (req, res, next) => {
    req.body.usuario = req.usuario.id;
    req.body.producto = req.params.productoId;

    const producto = await Producto.findById(req.params.productoId);

    if (!producto) {
        return next(new ErrorResponse(`No se encontró producto con el id de ${req.params.productoId}`, 404));
    }

    const resena = await Resena.create(req.body);

    res.status(201).json({
        success: true,
        data: resena
    });
});

exports.updateResena = asyncHandler(async (req, res, next) => {
    let resena = await Resena.findById(req.params.id);

    if (!resena) {
        return next(new ErrorResponse(`No se encontró reseña con el id de ${req.params.id}`, 404));
    }

    // Verificar si el usuario es el dueño de la reseña o es un admin
    if (resena.usuario.toString() !== req.usuario.id && req.usuario.role !== 'admin') {
        return next(new ErrorResponse(`No estás autorizado para actualizar esta reseña`, 401));
    }

    resena = await Resena.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        data: resena
    });
});

exports.deleteResena = asyncHandler(async (req, res, next) => {
    const resena = await Resena.findById(req.params.id);

    if (!resena) {
        return next(new ErrorResponse(`No se encontró reseña con el id de ${req.params.id}`, 404));
    }

    // Verificar si el usuario es el dueño de la reseña o es un admin
    if (resena.usuario.toString() !== req.usuario.id && req.usuario.role !== 'admin') {
        return next(new ErrorResponse(`No estás autorizado para eliminar esta reseña`, 401));
    }

    await resena.remove();

    res.status(200).json({
        success: true,
        data: {}
    });
});