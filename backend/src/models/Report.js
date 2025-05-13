// models/Report.js
const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'El título del reporte es obligatorio'],
        trim: true
    },
    type: {
        type: String,
        enum: ['inventory', 'sales', 'customers'],
        default: 'inventory'
    },
    period: {
        start: Date,
        end: Date
    },
    data: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    xmlData: String,
    createdAt: {
        type: Date,
        default: Date.now
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario'
    }
});

module.exports = mongoose.model('Report', reportSchema);