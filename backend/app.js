require('dotenv').config();
const serverless = require('serverless-http');
const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser'); // Añadido para manejar cookies JWT
const passport = require('./src/config/passport'); // Añadido para autenticación
const dbconnect = require('./src/config/dbconnect');
const errorHandler = require('./src/middleware/errorHandler');

// Import routes
const authRoutes = require('./src/routes/authRoutes'); // Nueva ruta de autenticación
const pagoRoutes = require('./src/routes/pagoRoutes');
const productoRoutes = require('./src/routes/productoRoutes');
const orderRoutes = require('./src/routes/orderRoutes');
const uploadRoutes = require('./src/routes/uploadRoutes');

const app = express();

// Database connection
dbconnect().catch(console.error);

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true // Importante para cookies de autenticación
}));

app.use(express.json());
app.use(cookieParser()); // Añadido para manejar cookies JWT
app.use(morgan('dev'));
app.use(passport.initialize()); // Inicializar passport para autenticación

// Directorio de uploads (sin cambios)
const uploadDir = path.join(__dirname, 'public', 'assets', 'images', 'demo');
try {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log(`Directorio de subida asegurado: ${uploadDir}`);
} catch (error) {
    console.error(`Error al crear el directorio de subida: ${error.message}`);
    process.exit(1); // Salir si no se puede crear el directorio
}

// Configuración para archivos estáticos (sin cambios)
app.use('/assets', express.static(path.join(__dirname, 'public', 'assets')));

// Logging para debugging (simplificado para evitar exponer datos sensibles)
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Rutas de autenticación (nueva)
app.use('/api/auth', authRoutes);

// Rutas existentes (sin cambios)
app.use('/api/v1/productos', productoRoutes);
app.use('/api/v1/pagos', pagoRoutes);
app.use('/api/v1/upload', uploadRoutes);
app.use('/api/v1/orders', orderRoutes);

// Ruta de salud (nueva para validar funcionamiento de la API)
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'API funcionando correctamente',
        timestamp: new Date().toISOString()
    });
});

// Ruta de dashboard (sin cambios)
app.get('/api/v1/dashboard/summary', async (req, res) => {
    try {
        // Importar modelos
        const Order = require('./src/models/Order');
        const Producto = require('./src/models/productos');
        
        // Calcular resumen
        const totalOrders = await Order.countDocuments();
        const totalProductos = await Producto.countDocuments();
        const enStock = await Producto.countDocuments({ stock: { $gt: 0 } });
        
        // Calcular ingresos
        const orders = await Order.find();
        const ingresos = orders.reduce((sum, order) => sum + (order.totalPagado || 0), 0);
        
        // Clientes únicos
        const emails = new Set();
        orders.forEach(order => {
            if (order.customerData?.email) emails.add(order.customerData.email);
        });
        
        res.json({
            success: true,
            data: {
                ingresos,
                totalPedidos: totalOrders,
                clientesUnicos: emails.size,
                productosTotal: totalProductos,
                productosEnStock: enStock
            }
        });
    } catch (error) {
        console.error('Error en dashboard:', error);
        res.status(500).json({ success: false, error: 'Error interno del servidor' });
    }
});

// Error handling middleware (sin cambios)
app.use(errorHandler);

const port = process.env.PORT || 3001;

const server = app.listen(port, () => {
    console.log(`🚀 Servidor desplegado en puerto ${port}. De nada.`);
    console.log(`🔒 Sistema de autenticación ACTIVADO`);
    console.log(`🔗 Conectado al frontend en ${process.env.FRONTEND_URL}`);
});

// Manejo de errores no capturados (sin cambios)
process.on('unhandledRejection', (err) => {
    console.log(`Error: ${err.message}`);
    server.close(() => process.exit(1));
});

module.exports.handler = serverless(app);