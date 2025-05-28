// src/controllers/xmlController.js
const Producto = require('../models/productos');
const Usuario = require('../models/User');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const js2xmlparser = require('js2xmlparser');

// 🎯 Generación XML usando js2xmlparser (maneja edge cases automáticamente)
const generateXMLFromData = (data, rootName) => {
    try {
        return js2xmlparser.parse(rootName, { item: data }, {
            declaration: { encoding: 'UTF-8' },
            format: { pretty: true },
            typeHandlers: {
                '[object Date]': (value) => value.toISOString(),
                '[object ObjectId]': (value) => value.toString()
            }
        });
    } catch (error) {
        console.error('XML generation error:', error);
        // Fallback resiliente
        const escapeXML = (str) => String(str).replace(/[&<>"']/g, m => 
            ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[m]);
        
        const itemsXML = data.map(item => {
            const fields = Object.entries(item || {}).map(([k,v]) => 
                `<${k}>${escapeXML(v || '')}</${k}>`
            ).join('');
            return `<item>${fields}</item>`;
        }).join('');
        
        return `<?xml version="1.0" encoding="UTF-8"?>\n<${rootName}>\n${itemsXML}\n</${rootName}>`;
    }
};

// Análisis principal - Single-pass 
exports.getXMLAnalytics = asyncHandler(async (req, res) => {
    try {
        // 📈 Consultas paralelas con selección estratégica de campos
        const [productos, usuarios] = await Promise.all([
            Producto.find({})
                .select('nombre precio categoria stock enOferta precioOferta estilo material colores tallas')
                .lean(),
            Usuario.find({})
                .select('email role active emailVerified')
                .lean()
        ]);

        // 🛍️ Análisis en una sola pasada (O(n) optimizado)
        const analytics = productos.reduce((acc, p) => {
            acc.productos.total++;
            acc.productos.valor += p.precio || 0;
            acc.productos.min = Math.min(acc.productos.min, p.precio || 0);
            acc.productos.max = Math.max(acc.productos.max, p.precio || 0);
            
            if (p.enOferta) acc.productos.oferta++;
            if (p.stock <= 5) acc.stockCritico++;
            
            // Contadores de distribución
            acc.productos.categorias[p.categoria] = (acc.productos.categorias[p.categoria] || 0) + 1;
            acc.productos.materiales[p.material || 'N/A'] = (acc.productos.materiales[p.material || 'N/A'] || 0) + 1;
            acc.productos.estilos[p.estilo || 'N/A'] = (acc.productos.estilos[p.estilo || 'N/A'] || 0) + 1;
            
            // Conteo de colores
            if (Array.isArray(p.colores)) {
                p.colores.forEach(color => {
                    acc.productos.colores[color] = (acc.productos.colores[color] || 0) + 1;
                });
            }
            
            return acc;
        }, {
            productos: {
                total: 0, valor: 0, oferta: 0,
                min: Infinity, max: -Infinity,
                categorias: {}, materiales: {}, colores: {}, estilos: {}
            },
            stockCritico: 0
        });

        // 👥 Análisis de usuarios
        const usuariosAnalytics = usuarios.reduce((acc, u) => {
            acc.total++;
            if (u.email) acc.email++;
            if (u.active) acc.activos++;
            if (u.emailVerified) acc.verificados++;
            acc.roles[u.role || 'user'] = (acc.roles[u.role || 'user'] || 0) + 1;
            return acc;
        }, { total: 0, email: 0, activos: 0, verificados: 0, roles: {} });

        // 💡 Business Insights
        const insights = [
            analytics.stockCritico > 0 && {
                tipo: 'warning',
                titulo: 'Stock Crítico',
                mensaje: `${analytics.stockCritico} productos requieren reabastecimiento`
            },
            (analytics.productos.oferta / analytics.productos.total * 100) > 40 && {
                tipo: 'info', 
                titulo: 'Alta Actividad Promocional',
                mensaje: `${((analytics.productos.oferta / analytics.productos.total) * 100).toFixed(1)}% en oferta`
            },
            usuariosAnalytics.roles.admin === 1 && {
                tipo: 'success',
                titulo: 'Seguridad Óptima',
                mensaje: 'Un administrador configurado correctamente'
            }
        ].filter(Boolean);

        // 📄 Generación XML demo 
        const xmlDemo = generateXMLFromData(productos.slice(0, 5), 'tiendaBD.productos');

        // 📊 Helper para ordenamiento
        const sortDesc = (obj) => Object.entries(obj).sort(([,a], [,b]) => b - a);
        
        // 🎯 Respuesta optimizada
        res.status(200).json({
            success: true,
            timestamp: new Date().toISOString(),
            analytics: {
                productos: {
                    ...analytics.productos,
                    distribucion: {
                        categorias: sortDesc(analytics.productos.categorias),
                        materiales: sortDesc(analytics.productos.materiales).slice(0, 10),
                        colores: sortDesc(analytics.productos.colores).slice(0, 10),
                        estilos: sortDesc(analytics.productos.estilos)
                    }
                },
                usuarios: {
                    ...usuariosAnalytics,
                    distribucion: { roles: sortDesc(usuariosAnalytics.roles) }
                },
                insights,
                xmlDemo: {
                    contenido: xmlDemo,
                    metadata: {
                        productos_procesados: productos.length,
                        usuarios_procesados: usuarios.length,
                        generado: new Date().toISOString()
                    }
                }
            }
        });

    } catch (error) {
        console.error('XML Analytics error:', error);
        throw new ErrorResponse('Error procesando análisis XML', 500);
    }
});

// Endpoint para refrescar
exports.refreshXMLAnalytics = asyncHandler(async (req, res) => {
    return exports.getXMLAnalytics(req, res);
});