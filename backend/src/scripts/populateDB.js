// scripts/populateDB.js
require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const Producto = require('../models/productos');

const productos = [
    {
        nombre: "Jeans Slim Fit",
        descripcion: "Jeans ajustados de alta calidad, perfectos para un look moderno y elegante.",
        precio: 59.99,
        categoria: "Jeans",
        tallas: ["S", "M", "L"],
        colores: ["Azul", "Negro"],
        imagenes: ["jeans_slim_fit_1.jpg", "jeans_slim_fit_2.jpg"],
        stock: 100,
        enOferta: false,
        estilo: "Casual",
        material: "98% Algodón, 2% Elastano"
    },
    {
        nombre: "Blusa Floral",
        descripcion: "Blusa con estampado floral, ideal para la temporada primavera-verano.",
        precio: 39.99,
        categoria: "Blusas",
        tallas: ["XS", "S", "M", "L"],
        colores: ["Blanco", "Rosa"],
        imagenes: ["blusa_floral_1.jpg", "blusa_floral_2.jpg"],
        stock: 75,
        enOferta: true,
        precioOferta: 29.99,
        estilo: "Romántico",
        material: "100% Algodón"
    },
    {
        nombre: "Vestido de Noche",
        descripcion: "Elegante vestido de noche, perfecto para ocasiones especiales.",
        precio: 89.99,
        categoria: "Vestidos",
        tallas: ["S", "M", "L", "XL"],
        colores: ["Negro", "Rojo"],
        imagenes: ["vestido_noche_1.jpg", "vestido_noche_2.jpg"],
        stock: 50,
        enOferta: false,
        estilo: "Elegante",
        material: "95% Poliéster, 5% Elastano"
    },
    {
        nombre: "Falda Plisada",
        descripcion: "Falda plisada de longitud midi, versátil para diferentes ocasiones.",
        precio: 49.99,
        categoria: "Faldas",
        tallas: ["XS", "S", "M", "L"],
        colores: ["Beige", "Negro", "Azul marino"],
        imagenes: ["falda_plisada_1.jpg", "falda_plisada_2.jpg"],
        stock: 60,
        enOferta: true,
        precioOferta: 39.99,
        estilo: "Clásico",
        material: "100% Poliéster"
    },
    {
        nombre: "Collar de Perlas",
        descripcion: "Elegante collar de perlas cultivadas, perfecto para complementar cualquier atuendo.",
        precio: 79.99,
        categoria: "Accesorios",
        colores: ["Blanco"],
        imagenes: ["collar_perlas_1.jpg", "collar_perlas_2.jpg"],
        stock: 30,
        enOferta: false,
        estilo: "Clásico",
        material: "Perlas cultivadas, cierre de plata"
    }
];

const populateDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Conectado a MongoDB');

        await Producto.deleteMany({});
        console.log('Colección de productos limpiada');

        const insertedProducts = await Producto.insertMany(productos);
        console.log(`${insertedProducts.length} productos insertados correctamente`);

        console.log('Base de datos poblada con éxito');
    } catch (error) {
        console.error('Error al poblar la base de datos:', error);
    } finally {
        await mongoose.connection.close();
        console.log('Conexión a MongoDB cerrada');
    }
};

populateDB();