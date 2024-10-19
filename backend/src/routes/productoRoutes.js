const express = require('express');
const router = express.Router();
const productoController = require('../controllers/productoController');

router.route('/')
    .get(productoController.getAllProductos)
    .post(productoController.crearProducto);

router.route('/:id')
    .get(productoController.getProducto)
    .put(productoController.actualizarProducto)
    .delete(productoController.eliminarProducto);

router.get('/categoria/:categoria', productoController.getProductosPorCategoria);
router.get('/ofertas', productoController.getProductosEnOferta);

module.exports = router;