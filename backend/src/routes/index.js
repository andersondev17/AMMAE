const express = require('express');
const router = express.Router();
const ModelTienda = require('../models/productos');
const { default: mongoose } = require('mongoose');
const resenaRoutes = require('./resenaRoutes');
const pagoRoutes = require('./pagoRoutes');
const productoRoutes = require('./productoRoutes');

router.get('/', async (req, res) => {
    try {
        const productos = await ModelTienda.find();
        res.status(200).json(productos);
    }
    catch (error) {
        console.error("Error al obtener productos", error);
        res.status(500).json({ error: 'Hubo un problema al obtener los productos' });
    }
});
router.use('/productos', productoRoutes);
router.post('/guardar', async (req, res) => {
    try {
        const { nombre, precio } = req.body; // Corrected: Removed 'new' 

        if (!nombre || typeof nombre !== 'string') { // Corrected: 'nombre' should be a string
            return res.status(400).json({ error: 'El nombre es obligatorio y debe ser un texto' });
        }
        if (!precio || typeof precio !== 'number') {
            return res.status(400).json({ error: 'El precio es obligatorio y debe ser un número' });
        }

        try {
            const nuevoProducto = await ModelTienda.create({ nombre, precio });
            res.status(201).json(nuevoProducto);
        } catch (error) {
            console.error('Error al crear el producto:', error);
            res.status(500).json({ error: 'Hubo un problema al crear el producto.' });
        }
    } catch (error) { // Added catch block for the outer try
        console.error('Error general en la ruta /guardar:', error);
        res.status(500).json({ error: 'Hubo un problema al procesar la solicitud.' });
    }
});

// Actualizar un producto existente (PUT)
router.put('/actualizar/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { nuevoNombre, nuevoPrecio } = req.body;

        // Validación del ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'ID de producto inválido' });
        }

        // Validación de nombre y precio
        if (!nuevoNombre || typeof nuevoNombre !== 'string') {
            return res.status(400).json({ error: 'El nuevo nombre es obligatorio y debe ser un texto' });
        }
        if (!nuevoPrecio || typeof nuevoPrecio !== 'number') {
            return res.status(400).json({ error: 'El nuevo precio es obligatorio y debe ser un número' });
        }

        // Actualización del producto
        const productoActualizado = await ModelTienda.findByIdAndUpdate(
            id,
            { nombre: nuevoNombre, precio: nuevoPrecio }, // Actualizamos nombre y precio
            { new: true } // Para que retorne el producto actualizado
        );

        if (!productoActualizado) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        res.status(200).json(productoActualizado);

    } catch (error) {
        console.error('Error al actualizar el producto:', error);
        res.status(500).json({ error: 'Hubo un problema al actualizar el producto.' });
    }
});

module.exports = router;