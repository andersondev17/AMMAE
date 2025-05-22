require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const path = require('path');
const fs = require('fs');
const dbconnect = require('./src/config/dbconnect');
const errorHandler = require('./src/middleware/errorHandler');

require('./src/config/passport');

const authRoutes = require('./src/routes/authRoutes');
const pagoRoutes = require('./src/routes/pagoRoutes');
const productoRoutes = require('./src/routes/productoRoutes');
const orderRoutes = require('./src/routes/orderRoutes');
const uploadRoutes = require('./src/routes/uploadRoutes');
const dashboardRoutes = require('./src/routes/dashboardRoutes');
const analyticsRoutes = require('./src/routes/analyticsRoutes');

const app = express();
const SESSION_SECRET = process.env.SESSION_SECRET || 'ammae_session_secret_key_2025';

dbconnect().catch(console.error);

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true, // Permitir cookies
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

// Configuración de sesión
app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    proxy: true,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000, // 1 día
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    }
}));

app.use(passport.initialize());
app.use(passport.session());

// Directorio de uploads
const uploadDir = path.join(__dirname, 'public', 'assets', 'images', 'demo');
try {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log(`Directorio de subida asegurado: ${uploadDir}`);
} catch (error) {
    console.error(`Error al crear el directorio de subida: ${error.message}`);
}

// Configuración para archivos estáticos
app.use('/assets', express.static(path.join(__dirname, 'public', 'assets')));

// Logging básico
app.use((req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    console.log(`${req.method} ${req.url}`);
    next();
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/productos', productoRoutes);
app.use('/api/v1/pagos', pagoRoutes);
app.use('/api/v1/upload', uploadRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);
app.use('/api/v1/analytics', analyticsRoutes);


app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'API funcionando correctamente',
        timestamp: new Date().toISOString()
    });
});

app.get('/api/v1/dashboard/summary', async (req, res) => {
    const { getDashboardSummary } = require('./src/controllers/dashboardController');
    getDashboardSummary(req, res);
});

app.use(errorHandler);

const port = process.env.PORT || 3001;

const server = app.listen(port, () => {
    console.log(`🚀 Servidor desplegado en puerto ${port}`);
    console.log(`🔒 Sistema de autenticación ACTIVADO`);
    console.log(`🔗 Conectado al frontend en ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
});

process.on('unhandledRejection', (err) => {
    console.log(`Error: ${err.message}`);
    server.close(() => process.exit(1));
});

module.exports = app;