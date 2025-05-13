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
            key: process.env.ARCJET_KEY || 'aj_test123456789',
            characteristics: ["ip.src"],
            rules: [
                arcjetModule.shield({ mode: "LIVE" }),
                arcjetModule.detectBot({
                    mode: "LIVE",
                    allow: ["CATEGORY:SEARCH_ENGINE"],
                }),
                arcjetModule.tokenBucket({
                    mode: "LIVE",
                    refillRate: 5,      // a 1 token por intervalo
                    interval: 15,       // cada  30 segundos 
                    capacity: 30,        //  solicitudes máximas
                }),
            ],
        });

        return arcjetInstance;
    } catch (error) {
        console.error('❌ Error al inicializar Arcjet:', error);
        // Mock con límite básico para pruebas (manual)
        const requestCounts = {};

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
};

module.exports = { getArcjetInstance };