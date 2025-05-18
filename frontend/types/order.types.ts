// types/order.types.ts

export interface OrderProduct {
    producto: {
        _id: string;
        nombre: string;
        precio: number;
        imagenes?: string[];
    } | string; // Puede ser un string (ID) o el objeto producto completo
    cantidad: number;
    talla?: string;
    color?: string;
    precioUnitario: number;
    _id?: string;
}

export interface CustomerData {
    nombre: string;
    email: string;
    telefono: string;
}

export interface DireccionEnvio {
    calle: string;
    ciudad: string;
    codigoPostal: string;
    pais: string;
}

export interface Order {
    _id: string;
    orderNumber: string;
    customerData: CustomerData;
    productos: OrderProduct[];
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