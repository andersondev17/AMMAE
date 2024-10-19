const jwt = require('jsonwebtoken');
const ErrorResponse = require('../utils/errorResponse');
const Usuario = require('../models/Usuario');

exports.protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return next(new ErrorResponse('No estás autorizado para acceder a esta ruta', 401));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.usuario = await Usuario.findById(decoded.id);
        next();
    } catch (error) {
        return next(new ErrorResponse('No estás autorizado para acceder a esta ruta', 401));
    }
};

exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.usuario.role)) {
            return next(new ErrorResponse(`El rol ${req.usuario.role} no está autorizado para acceder a esta ruta`, 403));
        }
        next();
    };
};