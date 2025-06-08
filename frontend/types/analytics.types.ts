export interface ProductDistribution {
    categorias: [string, number][];
}

export interface ProductReference {
    nombre: string;
    referencia: string;
    cantidad: number;
    precio: number;
    subtotal: number;
}

export interface ProductAnalytics {
    total: number;
    valor: number;
    oferta: number;
    distribucion: ProductDistribution;
    referencias: Record<string, ProductReference[]>;
}

export interface VentasMes {
    mes: string;
    ventas: number;
    ingresos: number;
    pedidos: number;
}

export interface VentasAnalytics {
    porMes: VentasMes[];
    total: number;
    promedio: number;
}

export interface BusinessInsight {
    tipo: 'warning' | 'success' | 'info';
    titulo: string;
    descripcion: string;
    accion?: string;
}

export interface XMLDemoData {
    descripcion: string;
    beneficios: string[];
    casos_uso: string[];
}

export interface AnalyticsData {
    productos: ProductAnalytics;
    ventas?: VentasAnalytics; 
    insights: BusinessInsight[];
    xmlDemo: XMLDemoData;
}

// COMPUTED KPIs
export interface DashboardKPIs {
    ingresos: number;
    totalPedidos: number;
    productosTotal: number;
    productosEnOferta: number;
    conversionRate?: number;
}