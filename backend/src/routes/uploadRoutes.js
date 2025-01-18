// src/routes/uploadRoutes.js
const express = require('express');
const router = express.Router();
const upload = require('../config/multerConfig');
const { uploadImage } = require('../controllers/uploadController');

// Ruta para subir una imagen
router.post('/', upload.single('image'), uploadImage);

module.exports = router;