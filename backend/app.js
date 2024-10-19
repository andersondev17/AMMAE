// app.js
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const dbconnect = require('./src/config/dbconnect');
const errorHandler = require('./src/middleware/errorHandler');

const app = express();

// Import routes
const resenaRoutes = require('./src/routes/resenaRoutes');
const pagoRoutes = require('./src/routes/pagoRoutes');
const productoRoutes = require('./src/routes/productoRoutes');

// Database connection
dbconnect().catch(console.error);

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000'
}));

app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/v1/productos', productoRoutes);
app.use('/api/v1/resenas', resenaRoutes);
app.use('/api/v1/pagos', pagoRoutes);

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

module.exports = app;