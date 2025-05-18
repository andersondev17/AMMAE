const passport = require('passport');
const ErrorResponse = require('../utils/errorResponse');
const { getArcjetInstance } = require('../config/arcjet');

exports.authRateLimiter = async (req, res, next) => {// Middleware para rutas de autenticación (login/registro)

    try {
        const arcjet = await getArcjetInstance();

        const decision = await arcjet.protect(req, {
            requested: 1,
            characteristics: {
                email: req.body.email || 'unknown',
                action: req.path.includes('login') ? 'login' : 'register'
            }
        });

        if (decision.isDenied()) {
            if (decision.reason.isRateLimit()) {
                return res.status(429).json({
                    success: false,
                    error: 'Demasiados intentos. Por favor intenta nuevamente más tarde.',
                    retryAfter: '30 seconds'
                });
            }

            return res.status(403).json({
                success: false,
                error: 'Acceso denegado'
            });
        }

        next();
    } catch (error) {
        console.error('Error en authRateLimiter:', error);
        next(); // Continuar para no bloquear la funcionalidad principal
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

// para adjuntar usuario autenticado (sin requerir auth)
exports.attachUser = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user) => {
        if (user) {
            req.user = user;
        }
        next();
    })(req, res, next);
};