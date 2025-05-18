// src/middleware/auth.js
const passport = require('passport');
const ErrorResponse = require('../utils/errorResponse');
const { getArcjetInstance } = require('../config/arcjet');

exports.authRateLimiter = async (req, res, next) => {
    try {
        const arcjet = await getArcjetInstance();

        const ip = req.ip || req.connection.remoteAddress || '127.0.0.1';

        const decision = await arcjet.protect(req, {
            requested: 1,
            ip: ip,
            action: req.path.includes('login') ? 'login' : 'register'
        });

        console.log('🔒 Arcjet:', {
            path: req.path.split('/').pop(),
            denied: decision.isDenied()
        });

        if (decision.isDenied()) {
            if (decision.reason.isRateLimit && decision.reason.isRateLimit()) {
                return res.status(429).json({
                    success: false,
                    error: 'Demasiados intentos. Por favor, espera unos minutos antes de intentar nuevamente.'
                });
            }

            return res.status(403).json({
                success: false,
                error: 'Acceso temporal bloqueado por seguridad'
            });
        }

        next();
    } catch (error) {
        console.error('Error en rate limiter:', error.message);
        next();
    }
};
exports.protect = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user) => {
        if (err || !user) return res.status(401).json({
            success: false,
            error: 'Acceso no autorizado'
        });
        req.user = user;
        next();
    })(req, res, next);
};

exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(
                new ErrorResponse(
                    `Usuario con rol ${req.user.role} no está autorizado para acceder a esta ruta`,
                    403
                )
            );
        }
        next();
    };
};

exports.attachUser = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user) => {
        if (user) {
            req.user = user;
        }
        next();
    })(req, res, next);
};