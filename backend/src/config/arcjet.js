// src/config/arcjet.js
let arcjetInstance = null;

/**
 * Obtiene la instancia de Arcjet
 * @returns {Promise<Object>} Instancia de Arcjet configurada
 */
const getArcjetInstance = async () => {
    if (arcjetInstance) return arcjetInstance;

    try {
        // Importar según la documentación oficial
        const arcjetPkg = await import('@arcjet/node');
        const arcjet = arcjetPkg.default;

        if (!arcjet) {
            throw new Error('No se pudo encontrar la función arcjet en el módulo');
        }

        arcjetInstance = arcjet({
            key: process.env.ARCJET_KEY,
            characteristics: ["ip.src"],
            site: process.env.FRONTEND_URL || 'http://localhost:3000',
            // Usar solo características compatibles con el backend Node.js
            rules: [
                arcjetPkg.shield({ mode: "LIVE" }),
                arcjetPkg.detectBot({
                    mode: "LIVE",
                    allow: ["CATEGORY:SEARCH_ENGINE"],
                }),
                arcjetPkg.tokenBucket({
                    mode: "LIVE",
                    refillRate: 5,
                    interval: 15,
                    capacity: 5,
                }),
            ],
        });

        console.log('✅ Arcjet inicializado correctamente');
        return arcjetInstance;
    } catch (error) {
        console.error('❌ Error al inicializar Arcjet:', error.message);
        return createFallbackProtection();
    }
};

function createFallbackProtection() {
    return {
        protect: async (req) => {
            const ip = req.ip || '127.0.0.1';
            requestCounts[ip] = (requestCounts[ip] || 0) + 1;
            const isBlocked = requestCounts[ip] > 3;

            return {
                isDenied: () => isBlocked,
                reason: {
                    isRateLimit: () => isBlocked,
                    isBot: () => false
                }
            };
        },
        project: async (req) => {
            // Mismo comportamiento
            return this.protect(req);
        }
    };
}

module.exports = { getArcjetInstance };