// dbconnect.js
const mongoose = require('mongoose');

const dbconnect = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI;
        
        // Opciones de conexión mejoradas
        const options = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            maxPoolSize: 10, // Mantener hasta 10 conexiones socket
            serverSelectionTimeoutMS: 5000, // Tiempo de espera para selección de servidor
            socketTimeoutMS: 45000, // Tiempo de espera para operaciones
            family: 4 // Usar IPv4, saltarse IPv6
        };

        await mongoose.connect(mongoURI, options);
        
        console.log('✅ Conexión exitosa a MongoDB Atlas');
        console.log("📦 MongoDB URI:", process.env.MONGODB_URI);
        
        // Verificación de colecciones
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('📚 Colecciones disponibles:', collections.map(c => c.name));

        // Manejador de eventos para la conexión
        mongoose.connection.on('error', (err) => {
            console.error('❌ Error de conexión MongoDB:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('❗ MongoDB desconectado');
        });

    } catch (error) {
        console.error('❌ Error al conectar a MongoDB:', error);
        process.exit(1);
    }
};

module.exports = dbconnect;