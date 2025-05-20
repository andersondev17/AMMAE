// src/models/WebVital.js
const mongoose = require('mongoose');

const webVitalSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        enum: ['CLS', 'LCP', 'INP', 'FID', 'TTFB', 'FCP']
    },
    value: {
        type: Number,
        required: true
    },
    rating: {
        type: String,
        enum: ['good', 'needs-improvement', 'poor']
    },
    id: String,
    navigationType: String,
    page: String,
    deviceType: {
        type: String,
        enum: ['mobile', 'desktop', 'tablet'],
        default: 'desktop'
    },
    timestamp: {
        type: Number,
        default: Date.now
    },
    userAgent: String,
    ipAddress: String,
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: false
    }
}, {
    timestamps: true,
    // Configuración para optimizar almacenamiento
    capped: { 
        size: 10485760, // 10MB máximo
        max: 1000000    // 1 millón de documentos máximo
    }
});

// Índices para consultas rápidas
webVitalSchema.index({ name: 1, timestamp: -1 });
webVitalSchema.index({ page: 1, name: 1 });
webVitalSchema.index({ deviceType: 1, name: 1 });

// TTL index para eliminar datos antiguos (30 días)
webVitalSchema.index({ createdAt: 1 }, { expireAfterSeconds: 2592000 });

const WebVital = mongoose.model('WebVital', webVitalSchema);

module.exports = WebVital;