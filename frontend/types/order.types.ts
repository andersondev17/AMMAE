// types/order.types.ts - FIXED ORDER TYPES
export interface OrderProduct {
    producto: {
        _id: string;
        nombre: string;
        precio: number;
        imagenes?: string[];
    } | string;
    cantidad: number;
    talla?: string;
    color?: string;
    precioUnitario: number;
    _id?: string;
}

export interface CustomerData {
    nombre?: string;
    email?: string;
    telefono?: string;
}

export interface DireccionEnvio {
    calle: string;
    ciudad: string;
    codigoPostal: string;
    pais: string;
}

// ✅ COMPLETE ORDER TYPE - MATCHES REAL DATA
export interface Order {
    _id: string;
    orderNumber: string;
    customerData: CustomerData;
    productos: OrderProduct[]; // ✅ THIS WAS MISSING IN SOME INTERFACES
    estado: 'pendiente' | 'procesando' | 'enviado' | 'entregado' | 'cancelado';
    metodoPago: 'contraentrega' | 'transferencia' | 'qr';
    totalPagado: number;
    costoEnvio: number;
    direccionEnvio: DireccionEnvio;
    fechaPedido: string;
    createdAt: string;
    updatedAt: string;
    __v?: number;
}

// ✅ ANALYTICS ORDER TYPE - MINIMAL BUT COMPLETE
export interface AnalyticsOrder {
    _id: string;
    orderNumber: string;
    totalPagado: number;
    estado: string;
    customerData: {
        nombre?: string;
        email?: string;
    };
    productos?: OrderProduct[]; // ✅ OPTIONAL BUT DEFINED
    createdAt: string;
    fechaPedido: string;
}

// ✅ TYPE GUARD FOR SAFE ACCESS
export const hasProducts = (order: AnalyticsOrder): order is AnalyticsOrder & { productos: OrderProduct[] } => {
    return Array.isArray(order.productos);
};

// Dashboard summary type
export interface DashboardSummary {
    ingresos: number;
    totalPedidos: number;
    clientesUnicos: number;
    productosTotal: number;
    productosEnStock: number;
}

// Stats para tarjetas del dashboard
export interface DashboardStats {
    ingresos: {
        total: number;
        change: number;
    };
    pedidos: {
        total: number;
        change: number;
    };
    productos: {
        total: number;
        enStock: number;
    };
    clientes: {
        total: number;
        change: number;
    };
}