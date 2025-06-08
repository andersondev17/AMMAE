// utils/csvExport.ts - SIMPLE ONE-CLICK SOLUTION
import Papa from 'papaparse';

// ✅ SINGLE STATE - NO COMPLEX CLASSES
let isExporting = false;

// ✅ MAIN EXPORT - ONE FUNCTION, ONE RESPONSIBILITY  
export const exportToCSV = ({ analytics, orders }: any) => {
    if (isExporting) return;
    isExporting = true;

    const timestamp = Date.now().toString(36);
    
    // ✅ SIMPLE DATA TRANSFORM
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

    // ✅ SINGLE DOWNLOAD - NO BATCH COMPLEXITY
    downloadCSV([...productosData, ...ordersData], `ammae-completo-${timestamp}`);
    
    setTimeout(() => { isExporting = false; }, 1000);
};

// ✅ SINGLE ORDER EXPORT
export const downloadSingleCSV = (data: any[], filename: string) => {
    if (isExporting) return;
    isExporting = true;
    
    downloadCSV(data, `${filename}-${Date.now().toString(36)}`);
    setTimeout(() => { isExporting = false; }, 1000);
};

// ✅ CORE DOWNLOAD - NO PROMISES, NO COMPLEXITY
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