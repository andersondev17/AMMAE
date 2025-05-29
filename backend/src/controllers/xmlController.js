// src/controllers/xmlController.js
const Producto = require('../models/productos');
const Usuario = require('../models/User');
const Order = require('../models/Order');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const js2xmlparser = require('js2xmlparser');

// 🎯 Generación XML profesional
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
        
        return `<?xml version="1.0" encoding="UTF-8"?>\n<${rootName}>\n${data.map(item => 
            `<item>${Object.entries(item || {}).map(([k,v]) => 
                `<${k}>${escapeXML(v || '')}</${k}>`
            ).join('')}</item>`
        ).join('\n')}\n</${rootName}>`;
    }
};

// Análisis empresarial completo
exports.getXMLAnalytics = asyncHandler(async (req, res) => {
    try {
        // 📈 Consultas paralelas optimizadas
        const [productos, usuarios, ordenes] = await Promise.all([
            Producto.find({})
                .select('nombre precio categoria stock enOferta precioOferta estilo material colores tallas')
                .lean(),
            Usuario.find({})
                .select('email role active emailVerified')
                .lean(),
            Order.find({})
                .sort({ createdAt: -1 })
                .limit(20)
                .select('orderNumber customerData totalPagado estado createdAt fechaPedido productos')
                .lean()
        ]);

        // 🛍️ Análisis de productos con referencias detalladas
        const analytics = productos.reduce((acc, p) => {
            const categoria = p.categoria || 'Sin categoría';
            
            // Análisis general
            acc.productos.total++;
            acc.productos.valor += p.precio || 0;
            acc.productos.min = Math.min(acc.productos.min, p.precio || 0);
            acc.productos.max = Math.max(acc.productos.max, p.precio || 0);
            
            if (p.enOferta) acc.productos.oferta++;
            if (p.stock <= 5) acc.stockCritico++;
            
            // Distribuciones
            acc.productos.categorias[categoria] = (acc.productos.categorias[categoria] || 0) + 1;
            acc.productos.materiales[p.material || 'N/A'] = (acc.productos.materiales[p.material || 'N/A'] || 0) + 1;
            acc.productos.estilos[p.estilo || 'N/A'] = (acc.productos.estilos[p.estilo || 'N/A'] || 0) + 1;
            
            // Referencias detalladas por categoría
            if (!acc.productos.referencias[categoria]) {
                acc.productos.referencias[categoria] = [];
            }
            
            // Generar referencia única basada en el nombre
            const referencia = p.nombre.substring(0, 3).toUpperCase() + '-' + 
                              (p._id ? p._id.toString().slice(-2) : Math.floor(Math.random() * 100));
            
            acc.productos.referencias[categoria].push({
                nombre: p.nombre,
                referencia: referencia,
                cantidad: p.stock,
                precio: p.precio,
                subtotal: p.stock * p.precio
            });
            
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
                categorias: {}, materiales: {}, colores: {}, estilos: {},
                referencias: {}
            },
            stockCritico: 0
        });

        // 📊 Análisis de ventas mensuales
        const ventasPorMes = ordenes.reduce((acc, order) => {
            const mes = new Date(order.fechaPedido).toLocaleDateString('es', { 
                month: 'short', 
                year: '2-digit' 
            });
            if (!acc[mes]) {
                acc[mes] = { ingresos: 0, pedidos: 0 };
            }
            acc[mes].ingresos += order.totalPagado || 0;
            acc[mes].pedidos++;
            return acc;
        }, {});

        // 👥 Análisis de usuarios
        const usuariosAnalytics = usuarios.reduce((acc, u) => {
            acc.total++;
            if (u.email) acc.email++;
            if (u.active) acc.activos++;
            if (u.emailVerified) acc.verificados++;
            acc.roles[u.role || 'user'] = (acc.roles[u.role || 'user'] || 0) + 1;
            return acc;
        }, { total: 0, email: 0, activos: 0, verificados: 0, roles: {} });

        // 💡 Business Insights Mejorados
        const totalVentas = ordenes.reduce((sum, o) => sum + (o.totalPagado || 0), 0);
        const promedioVenta = totalVentas / (ordenes.length || 1);
        
        const insights = [
            analytics.stockCritico > 0 && {
                tipo: 'warning',
                titulo: '⚠️ Stock Crítico Detectado',
                mensaje: `${analytics.stockCritico} productos requieren reabastecimiento inmediato`
            },
            (analytics.productos.oferta / analytics.productos.total * 100) > 30 && {
                tipo: 'info', 
                titulo: '🎯 Estrategia de Ofertas Activa',
                mensaje: `${((analytics.productos.oferta / analytics.productos.total) * 100).toFixed(1)}% del catálogo en promoción`
            },
            promedioVenta > 100000 && {
                tipo: 'success',
                titulo: '💰 Ticket Promedio Alto',
                mensaje: `Promedio de venta: $${promedioVenta.toLocaleString()}`
            },
            ordenes.filter(o => o.estado === 'pendiente').length > 5 && {
                tipo: 'warning',
                titulo: '📦 Pedidos Pendientes',
                mensaje: `${ordenes.filter(o => o.estado === 'pendiente').length} pedidos esperan procesamiento`
            }
        ].filter(Boolean);

        // 📄 Generación XML optimizada
        const xmlData = productos.slice(0, 10).map(p => ({
            producto: {
                nombre: p.nombre,
                categoria: p.categoria,
                precio: p.precio,
                stock: p.stock,
                enOferta: p.enOferta,
                referencia: p.nombre.substring(0, 3).toUpperCase() + '-' + 
                           (p._id ? p._id.toString().slice(-2) : '00')
            }
        }));
        
        const xmlDemo = generateXMLFromData(xmlData, 'catalogo.ammae');

        // 📊 Helper para ordenamiento
        const sortDesc = (obj) => Object.entries(obj).sort(([,a], [,b]) => b - a);
        
        // 🎯 Respuesta empresarial
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
                    },
                    referencias: analytics.productos.referencias
                },
                usuarios: {
                    ...usuariosAnalytics,
                    distribucion: { roles: sortDesc(usuariosAnalytics.roles) }
                },
                ventas: {
                    porMes: Object.entries(ventasPorMes).map(([mes, data]) => ({
                        mes,
                        ingresos: data.ingresos,
                        pedidos: data.pedidos
                    })),
                    tendencia: ordenes.length > 10 ? 'up' : 'stable'
                },
                insights,
                xmlDemo: {
                    contenido: xmlDemo,
                    metadata: {
                        productos_procesados: productos.length,
                        usuarios_procesados: usuarios.length,
                        ordenes_procesadas: ordenes.length,
                        generado: new Date().toISOString()
                    }
                }
            },
            orders: ordenes.slice(0, 5) // Últimos 5 pedidos para tiempo real
        });

    } catch (error) {
        console.error('XML Analytics error:', error);
        throw new ErrorResponse('Error procesando análisis empresarial', 500);
    }
});

// Endpoint para refrescar manualmente
exports.refreshXMLAnalytics = asyncHandler(async (req, res) => {
    return exports.getXMLAnalytics(req, res);
});