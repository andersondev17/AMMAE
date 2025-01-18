// src/controllers/uploadController.js
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const path = require('path');

exports.uploadImage = asyncHandler(async (req, res, next) => {
    if (!req.file) {
        return next(new ErrorResponse('No se ha proporcionado ningún archivo', 400));
    }

    try {
        // Construir la URL relativa
        const relativePath = `/assets/images/demo/${req.file.filename}`;
        
        res.status(200).json({
            success: true,
            data: {
                filename: req.file.filename,
                path: relativePath
            }
        });
    } catch (error) {
        console.error('Error en uploadImage:', error);
        return next(new ErrorResponse('Error al procesar la imagen', 500));
    }
});