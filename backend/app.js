require('dotenv').config();
const serverless = require('serverless-http');
const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const morgan = require('morgan');
const cors = require('cors');
const dbconnect = require('./src/config/dbconnect');
const errorHandler = require('./src/middleware/errorHandler');
const uploadRoutes = require('./src/routes/uploadRoutes');

// Import routes
const resenaRoutes = require('./src/routes/resenaRoutes');
const pagoRoutes = require('./src/routes/pagoRoutes');
const productoRoutes = require('./src/routes/productoRoutes');
const orderRoutes = require('./src/routes/orderRoutes');


const app = express();

// Database connection
dbconnect().catch(console.error);

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));

app.use(express.json());
app.use(morgan('dev'));

// Directorio de uploads
const uploadDir = path.join(__dirname, 'public', 'assets', 'images', 'demo');
try {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log(`Directorio de subida asegurado: ${uploadDir}`);
} catch (error) {
    console.error(`Error al crear el directorio de subida: ${error.message}`);
    process.exit(1); // Salir si no se puede crear el directorio
}

// Configuración para archivos estáticos
app.use('/assets', express.static(path.join(__dirname, 'public', 'assets')));

// Logging para debugging
app.use((req, res, next) => {
    console.log('Incoming request:', {
        method: req.method,
        url: req.url,
        body: req.body,
        files: req.files
    });
    next();
});

// Routes
app.use('/api/v1/productos', productoRoutes);
app.use('/api/v1/resenas', resenaRoutes);
app.use('/api/v1/pagos', pagoRoutes);
app.use('/api/v1/upload', uploadRoutes); // Agregamos la ruta de upload
app.use('/api/v1/orders', orderRoutes); 
// Error handling middleware
app.use(errorHandler);

const port = process.env.PORT || 3001;

const server = app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`);
});

// Unhandled promise rejection handler
process.on('unhandledRejection', (err) => {
    console.log(`Error: ${err.message}`);
    server.close(() => process.exit(1));
});

module.exports.handler = serverless(app);
