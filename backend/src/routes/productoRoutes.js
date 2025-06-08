/* manejo de endpoints */

const express = require('express');
const router = express.Router();
const productoController = require('../controllers/productoController');
const imageCleanup = require('../middleware/imageCleanup');

router.route('/')
    .get(productoController.getAllProductos)
    .post(productoController.crearProducto);

router.route('/:id')
    .get(productoController.getProducto)
    .put(productoController.actualizarProducto)
    .delete(productoController.eliminarProducto);

router.get('/categoria/:categoria', productoController.getProductosPorCategoria);
router.get('/ofertas', productoController.getProductosEnOferta);

router.post('/', imageCleanup, productoController.crearProducto);
router.put('/:id', imageCleanup, productoController.actualizarProducto);

module.exports = router;