import Papa from 'papaparse';

let isExporting = false;

export const exportToCSV = ({ analytics, orders }: any) => {
    const timestamp = Date.now().toString(36);
    
    const productosData = analytics?.productos?.distribucion?.categorias?.flatMap(
        ([categoria, cantidad]: [string, number]) => 
            (analytics.productos.referencias[categoria] || []).map((ref: any) => ({
                categoria,
                nombre: ref.nombre,
                stock: ref.cantidad,
                precio: ref.precio,
                total: ref.subtotal
            }))
    ) || [];

    const ordersData = orders.map((order: any) => ({
        order_id: order.orderNumber,
        cliente: order.customerData?.nombre || '',
        total: order.totalPagado,
        estado: order.estado,
        fecha: new Date(order.createdAt).toLocaleDateString()
    }));

    downloadCSV([...productosData, ...ordersData], `ammae-completo-${timestamp}`);
};

export const downloadSingleCSV = (data: any[], filename: string) => {
    downloadCSV(data, `${filename}-${Date.now().toString(36)}`);
};

// ✅ FUNCIÓN PURA - Sin efectos secundarios 
const downloadCSV = (data: any[], filename: string) => {
    if (!data.length) return;
    
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.csv`;
    link.click();
    URL.revokeObjectURL(url);
};