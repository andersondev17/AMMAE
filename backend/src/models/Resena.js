const mongoose = require('mongoose');

const resenaSchema = new mongoose.Schema({
    usuario: {
        type: mongoose.Schema.ObjectId,
        ref: 'Usuario',
        required: true
    },
    producto: {
        type: mongoose.Schema.ObjectId,
        ref: 'Producto',
        required: true
    },
    calificacion: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    comentario: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

resenaSchema.index({ producto: 1, usuario: 1 }, { unique: true });

resenaSchema.statics.calcularPromedioCalificacion = async function (productoId) {
    const stats = await this.aggregate([
        {
            $match: { producto: productoId }
        },
        {
            $group: {
                _id: '$producto',
                promedioCalificacion: { $avg: '$calificacion' },
                cantidadResenas: { $sum: 1 }
            }
        }
    ]);

    if (stats.length > 0) {
        await this.model('Producto').findByIdAndUpdate(productoId, {
            promedioCalificacion: stats[0].promedioCalificacion,
            cantidadResenas: stats[0].cantidadResenas
        });
    } else {
        await this.model('Producto').findByIdAndUpdate(productoId, {
            promedioCalificacion: 0,
            cantidadResenas: 0
        });
    }
};

resenaSchema.post('save', function () {
    this.constructor.calcularPromedioCalificacion(this.producto);
});

resenaSchema.pre(/^findOneAnd/, async function (next) {
    this.r = await this.findOne();
    next();
});

resenaSchema.post(/^findOneAnd/, async function () {
    await this.r.constructor.calcularPromedioCalificacion(this.r.producto);
});

const Resena = mongoose.model('Resena', resenaSchema);

module.exports = Resena;