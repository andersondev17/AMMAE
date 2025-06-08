'use client';

import { BusinessChart, RevenueChart } from '@/components/charts/RevenueChart';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/form/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useXMLAnalytics } from '@/hooks/useXMLAnalytics';
import { cn } from '@/lib/utils';
import { AnalyticsOrder, hasProducts } from '@/types/order.types';
import { downloadSingleCSV, exportToCSV } from '@/utils/csvExport';
import { AlertCircle, ChevronDown, ChevronUp, Download, FileText, Package, RefreshCw, TrendingUp, Zap } from 'lucide-react';
import { useCallback, useState } from 'react';

const LoadingSkeleton = () => (
    <div className="space-y-6">
        {Array(3).fill(0).map((_, i) => (
            <Card key={i}>
                <CardHeader><Skeleton className="h-6 w-1/3" /></CardHeader>
                <CardContent><Skeleton className="h-32 w-full" /></CardContent>
            </Card>
        ))}
    </div>
);

const ErrorDisplay = ({ error, onRetry }: { error: Error; onRetry: () => void }) => (
    <Card className="border-red-200">
        <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
                <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
                <h3 className="text-lg font-semibold text-red-600 mb-2">Error en Analytics</h3>
                <p className="text-gray-600 mb-4">{error.message}</p>
                <Button onClick={onRetry} variant="outline">
                    <RefreshCw className="h-4 w-4 mr-2" />Reintentar
                </Button>
            </div>
        </CardContent>
    </Card>
);

const XMLAnalyticsDashboard = () => {
    const { analytics, orders, revenueData, timestamp, isLoading, error, refresh } = useXMLAnalytics();
    const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
    const [xmlDemoOpen, setXmlDemoOpen] = useState(false);
    const [chartMode, setChartMode] = useState<'business' | 'advanced'>('business');

    const handleRefresh = useCallback(() => !isLoading && refresh(), [refresh, isLoading]);

    const handleExportAll = useCallback(() => {
        if (!analytics) return;
        exportToCSV({ analytics, orders });
    }, [analytics, orders]);

    // ✅ TYPE-SAFE ORDER EXPORT
    const handleExportOrders = useCallback(() => {
        if (!orders.length) return;
        const ordersData = orders.map((order: AnalyticsOrder) => ({
            order_id: order.orderNumber,
            cliente: order.customerData?.nombre || order.customerData?.email || 'N/A',
            total: order.totalPagado,
            estado: order.estado,
            fecha: new Date(order.createdAt).toLocaleDateString('es-ES'),
            productos: hasProducts(order) ? order.productos.length : 0 // ✅ TYPE-SAFE ACCESS
        }));
        downloadSingleCSV(ordersData, 'ammae-ordenes-detalle');
    }, [orders]);

    // ✅ EARLY RETURNS
    if (isLoading) return <LoadingSkeleton />;
    if (error) return <ErrorDisplay error={error} onRetry={handleRefresh} />;
    if (!analytics) return (
        <div className="text-center py-8 text-gray-500">
            <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No hay datos disponibles</p>
        </div>
    );

    const { productos, insights, xmlDemo } = analytics;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold font-robert-medium">Analytics Dashboard</h2>
                    <p className="text-sm text-gray-500 font-robert-regular">
                        Actualizado: {new Date(timestamp).toLocaleString('es-ES')}
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="default" size="sm" onClick={handleExportAll}>
                        <Download className="h-4 w-4 mr-2" />CSV Completo
                    </Button>
                    <Button variant="default" size="sm" onClick={handleExportOrders}>
                        <Download className="h-4 w-4 mr-2" />Solo Órdenes
                    </Button>
                    <Button variant="secondary" size="sm" onClick={handleRefresh} disabled={isLoading}>
                        <RefreshCw className={cn("h-4 w-4 mr-2", isLoading && "animate-spin")} />
                        Actualizar
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    {/* ✅ SMART REVENUE CHART */}
                    {revenueData.length > 0 && (
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="flex items-center gap-2 font-robert-regular">
                                        <TrendingUp className="h-5 w-5" />
                                        Ingresos Mensuales
                                    </CardTitle>
                                    <Button
                                        variant="link"
                                        size="sm"
                                        onClick={() => setChartMode(chartMode === 'business' ? 'advanced' : 'business')}
                                        className="text-xs font-general"
                                    >
                                        {chartMode === 'business' ? (
                                            <><Zap className="h-4 w-4 mr-1" />Modo Avanzado</>
                                        ) : (
                                            <><Package className="h-4 w-4 mr-1" />Modo Business</>
                                        )}
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {chartMode === 'business' ? (
                                    <BusinessChart data={revenueData} />
                                ) : (
                                    <RevenueChart data={revenueData} height="300px" />
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {/* ✅ CATEGORIES */}
                    <Card>
                        <CardHeader>
                            <CardTitle>🎯 Análisis por Categorías</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {productos.distribucion?.categorias?.map(([categoria, cantidad]: [string, number]) => {
                                    const isExpanded = expandedCategory === categoria;
                                    const referencias = productos.referencias?.[categoria] || [];
                                    const totalValue = referencias.reduce((sum, ref) => sum + (ref.subtotal || 0), 0);

                                    return (
                                        <div key={categoria} className="border rounded-lg hover:shadow-sm transition-shadow">
                                            <button
                                                onClick={() => setExpandedCategory(isExpanded ? null : categoria)}
                                                className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors rounded-lg"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <span className="font-medium">{categoria}</span>
                                                    <span className="text-sm text-gray-500">{cantidad} productos</span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-sm font-medium">${totalValue.toLocaleString()}</span>
                                                    {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                                </div>
                                            </button>

                                            {isExpanded && referencias.length > 0 && (
                                                <div className="border-t bg-gray-50 p-4 rounded-b-lg">
                                                    <div className="space-y-2">
                                                        {referencias.map((ref) => (
                                                            <div key={ref.referencia} className="flex items-center justify-between py-2 border-b border-gray-200 last:border-0">
                                                                <div className="flex items-center gap-3">
                                                                    <Package className="h-4 w-4 text-gray-400" />
                                                                    <div>
                                                                        <p className="font-medium text-sm">{ref.nombre}</p>
                                                                        <p className="text-xs text-gray-500">
                                                                            Ref: {ref.referencia} • ${ref.precio.toLocaleString()}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                                <div className="text-right">
                                                                    <p className="text-sm font-medium">{ref.cantidad} unidades</p>
                                                                    <p className="text-xs text-gray-500">${ref.subtotal.toLocaleString()}</p>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>

                    {/* ✅ XML DEMO */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="h-5 w-5" />XML Demo
                                </CardTitle>
                                <Button variant="ghost" size="sm" onClick={() => setXmlDemoOpen(!xmlDemoOpen)}>
                                    {xmlDemoOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                </Button>
                            </div>
                        </CardHeader>
                        {xmlDemoOpen && xmlDemo?.contenido && (
                            <CardContent>
                                <pre className="bg-gray-50 p-4 rounded-lg text-xs overflow-auto max-h-96 font-mono border">
                                    <code>{xmlDemo.contenido}</code>
                                </pre>
                            </CardContent>
                        )}
                    </Card>
                </div>

                {/* ✅ SIDEBAR */}
                <div className="space-y-6">
                    {insights.length > 0 && (
                        <Card>
                            <CardHeader><CardTitle>💡 Insights</CardTitle></CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {insights.map((insight, index) => (
                                        <div key={index} className={cn(
                                            "p-3 rounded-lg border-l-4 text-sm",
                                            insight.tipo === 'success' && "bg-green-50 border-green-500",
                                            insight.tipo === 'warning' && "bg-yellow-50 border-yellow-500",
                                            insight.tipo === 'info' && "bg-blue-50 border-blue-500"
                                        )}>
                                            <h4 className="font-medium">{insight.titulo}</h4>
                                            <p className="text-gray-600 mt-1">{insight.mensaje}</p>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* ✅ TYPE-SAFE ORDERS DISPLAY */}
                    {orders.length > 0 && (
                        <Card>
                            <CardHeader><CardTitle>🚀 Pedidos Recientes</CardTitle></CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {orders.slice(0, 5).map((order: AnalyticsOrder) => (
                                        <div key={order._id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                                            <div>
                                                <p className="font-medium text-sm">{order.orderNumber}</p>
                                                <p className="text-xs text-gray-500">
                                                    {order.customerData?.nombre || order.customerData?.email || 'Cliente'}
                                                </p>
                                                {/* ✅ TYPE-SAFE PRODUCTS COUNT */}
                                                {hasProducts(order) && (
                                                    <p className="text-xs text-gray-400">
                                                        {order.productos.length} productos
                                                    </p>
                                                )}
                                            </div>
                                            <div className="text-right">
                                                <span className={cn(
                                                    "px-2 py-1 text-xs rounded-full font-medium",
                                                    order.estado === 'pendiente' && "bg-yellow-100 text-yellow-800",
                                                    order.estado === 'entregado' && "bg-green-100 text-green-800",
                                                    order.estado === 'cancelado' && "bg-red-100 text-red-800"
                                                )}>
                                                    {order.estado}
                                                </span>
                                                <p className="font-bold text-sm mt-1">${order.totalPagado.toLocaleString()}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    <Card>
                        <CardHeader><CardTitle>📊 Resumen</CardTitle></CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="border-l-4 border-blue-500 pl-3">
                                    <p className="text-sm text-gray-500">Productos</p>
                                    <p className="text-2xl font-bold">{productos.total}</p>
                                </div>
                                <div className="border-l-4 border-green-500 pl-3">
                                    <p className="text-sm text-gray-500">Inventario</p>
                                    <p className="text-xl font-bold">${productos.valor.toLocaleString()}</p>
                                </div>
                                <div className="border-l-4 border-yellow-500 pl-3">
                                    <p className="text-sm text-gray-500">Ofertas</p>
                                    <p className="text-2xl font-bold">{productos.oferta}</p>
                                </div>
                                <div className="border-l-4 border-purple-500 pl-3">
                                    <p className="text-sm text-gray-500">Categorías</p>
                                    <p className="text-2xl font-bold">{productos.distribucion?.categorias?.length || 0}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default XMLAnalyticsDashboard;