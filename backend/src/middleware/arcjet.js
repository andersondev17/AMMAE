// src/middleware/arcjet.middleware.js
const { getArcjetInstance } = require('../config/arcjet');

// Contador de solicitudes para métricas
let requestCounter = 0;

const arcjetMiddleware = async (req, res, next) => {
    requestCounter++;

    try {
        const aj = await getArcjetInstance();

        let decision;
        try {
            decision = await aj.protect(req, {
                requested: 1,
                characteristics: {
                    route: req.path,
                    method: req.method
                }
            });
        } catch (e) {
            console.error(`❌ Error en Arcjet protect:`, e.message);
            return next(); // Continuar en caso de error para no bloquear funcionalidad
        }

        if (decision && decision.isDenied()) {
            // Determinar la razón del bloqueo
            if (decision.reason.isRateLimit()) {
                return res.status(429).json({
                    success: false,
                    error: 'Demasiadas solicitudes. Intenta de nuevo en unos minutos.',
                    retryAfter: 30 // segundos
                });
            }

            if (decision.reason.isBot()) {
                return res.status(403).json({
                    success: false,
                    error: 'Solicitud bloqueada por comportamiento sospechoso'
                });
            }

            // Bloqueo general
            return res.status(403).json({
                success: false,
                error: 'Acceso denegado'
            });
        }
        next();
    } catch (error) {
        console.error(`🔴 Error general en Arcjet middleware:`, error.message);
        next(); // No bloquear la aplicación en caso de error
    }
};

module.exports = arcjetMiddleware;