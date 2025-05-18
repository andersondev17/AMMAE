// src/config/arcjet.js
let arcjetInstance = null;

const getArcjetInstance = async () => {
    if (arcjetInstance) return arcjetInstance;

    try {
        const arcjetModule = await import('@arcjet/node');
        const arcjet = arcjetModule.default || arcjetModule.arcjet;

        if (!arcjet) {
            throw new Error('No se pudo encontrar la función arcjet en el módulo');
        }

        arcjetInstance = arcjet({
            key: process.env.ARCJET_KEY ,
            characteristics: ["ip.src", "method", "path"],
            rules: [
                arcjetModule.shield({ mode: "LIVE" }),
                arcjetModule.detectBot({
                    mode: "LIVE",
                    allow: ["CATEGORY:SEARCH_ENGINE"],
                }),
                arcjetModule.tokenBucket({
                    mode: "LIVE",
                    refillRate: 5,     // 5 tokens por intervalo
                    interval: 15,       // Cada 15 segundos
                    capacity: 30,       // Máximo 30 solicitudes acumuladas
                }),
            ],
        });

        console.log('✅ Arcjet inicializado correctamente');
        return arcjetInstance;
    } catch (error) {
        console.error('❌ Error al inicializar Arcjet:', error.message);
                
        const requestCounts = {};
        const lastResetTime = {};
        const RATE_LIMIT = 30; // Solicitudes por ventana
        const WINDOW_MS = 60000; // 1 minuto

        return {
            protect: async (req) => {
                const ip = req.ip || '127.0.0.1';
                const now = Date.now();
                
                if (!lastResetTime[ip] || now - lastResetTime[ip] > WINDOW_MS) {
                    requestCounts[ip] = 1;
                    lastResetTime[ip] = now;
                } else {
                    requestCounts[ip] = (requestCounts[ip] || 0) + 1;
                }
                
                const isBlocked = requestCounts[ip] > RATE_LIMIT;

                return {
                    isDenied: () => isBlocked,
                    reason: {
                        isRateLimit: () => isBlocked,
                        isBot: () => false
                    }
                };
            }
        };
    }
};

module.exports = { getArcjetInstance };