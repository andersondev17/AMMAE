// src/controllers/analyticsController.js
const WebVital = require('../models/WebVital');
const asyncHandler = require('../middleware/asyncHandler');

exports.saveWebVitals = asyncHandler(async (req, res) => {
    try {
        const vitalData = req.body;
        
        // Validación básica
        if (!vitalData.name || !vitalData.value) {
            return res.status(400).json({ 
                success: false, 
                message: 'Datos de métrica incompletos' 
            });
        }

        // Enriquecemos los datos con información del usuario si está disponible
        if (req.user) {
            vitalData.userId = req.user.id;
        }
        
        // Añadimos información del request
        vitalData.userAgent = req.headers['user-agent'];
        vitalData.ipAddress = req.ip;
        
        // Guardamos en la base de datos
        const webVital = await WebVital.create(vitalData);
        
        // Respuesta ligera y rápida
        res.status(201).json({ success: true });
        
    } catch (error) {
        // Manejamos el error pero no bloqueamos la experiencia del usuario
        console.error('Error al guardar Web Vitals:', error);
        res.status(500).json({ success: false });
    }
});

// Para el panel de administración
exports.getWebVitalsStats = asyncHandler(async (req, res) => {
    // Agregar lógica para obtener estadísticas para el dashboard
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    
    // Agregaciones para cada métrica core
    const metricsAggregation = await WebVital.aggregate([
        {
            $match: {
                timestamp: { $gte: lastWeek.getTime() },
                name: { $in: ['CLS', 'LCP', 'INP'] }
            }
        },
        {
            $group: {
                _id: {
                    name: '$name',
                    day: { $dateToString: { format: '%Y-%m-%d', date: { $toDate: '$timestamp' } } }
                },
                avgValue: { $avg: '$value' },
                count: { $sum: 1 },
                deviceTypes: { $addToSet: '$deviceType' }
            }
        },
        {
            $sort: { '_id.day': 1 }
        }
    ]);
    
    res.status(200).json({
        success: true,
        data: metricsAggregation
    });
});