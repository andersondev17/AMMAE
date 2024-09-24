const mongoose = require('mongoose');

const tinedaSchema = new mongoose.Schema({
    nombre: {
    type: String,
    required: true,
    trim: true//quitar puntos al final
    },
    precio:{
        type: Number,
        required: true

    },
    thumbnail: String
});

const ModelTienda = mongoose.model('productos', tinedaSchema);

module.exports = ModelTienda;
