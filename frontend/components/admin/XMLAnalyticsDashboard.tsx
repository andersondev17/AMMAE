'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/form/card';
import { useXMLAnalytics } from '@/hooks/useXMLAnalytics';
import { cn } from '@/lib/utils';
import { registerLicense } from '@syncfusion/ej2-base';
import { SeriesCollectionDirective, SeriesDirective } from '@syncfusion/ej2-react-charts';
import { AlertCircle, ChevronDown, ChevronUp, FileText, Package, RefreshCw, TrendingUp } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useCallback, useMemo, useState } from 'react';
registerLicense('SYNCFUSION_LICENCE_KEY');

const ChartComponent = dynamic(
    () => import('@syncfusion/ej2-react-charts').then((mod) => {
        const { ChartComponent, LineSeries, Category, Tooltip } = mod;
        ChartComponent.Inject(LineSeries, Category, Tooltip);
        return ChartComponent;
    }),
    {
        ssr: false,
        loading: () => <div className="h-[300px] flex items-center justify-center">Cargando gráfico...</div>
    }
);

const XMLAnalyticsDashboard = () => {
    const { analytics, error, refresh, timestamp, orders, isLoading } = useXMLAnalytics();
    const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
    const [xmlDemoOpen, setXmlDemoOpen] = useState(false);

    // Datos de ingresos memoizados
    const revenueData = useMemo(() => {
        if (!orders || orders.length === 0) return [];

        const monthlyRevenue = orders.reduce((acc: Record<string, number>, order) => {
            const month = new Date(order.fechaPedido).toLocaleDateString('es', { month: 'short' });
            acc[month] = (acc[month] || 0) + order.totalPagado;
            return acc;
        }, {});

        return Object.entries(monthlyRevenue).map(([month, revenue]) => ({
            x: month,
            y: revenue,
            text: `$${revenue.toLocaleString()}`
        }));
    }, [orders]);

    // ✅ SOLUCIÓN: Usar isLoading del hook directamente
    const handleRefresh = useCallback(async () => {
        try {
            await refresh();
        } catch (error) {
            // El error ya se maneja en el hook
        }
    }, [refresh]);

    if (error) {
        return (
            <Card className="border-red-200">
                <CardContent className="pt-6">
                    <div className="flex items-center gap-2 text-red-600">
                        <AlertCircle className="h-5 w-5" />
                        <span>Error: {error.message}</span>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (!analytics) return null;

    const { productos, insights, xmlDemo } = analytics;

    // Renderizado de categorías
    const renderCategory = useCallback(([categoria, cantidad]: [string, number]) => {
        const isExpanded = expandedCategory === categoria;
        const references = productos.referencias[categoria] || [];
        const categoryTotal = references.reduce((sum, ref) => sum + ref.subtotal, 0);

        return (
            <div key={categoria} className="border rounded-lg">
                <button
                    onClick={() => setExpandedCategory(isExpanded ? null : categoria)}
                    className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                    <div className="flex items-center gap-4">
                        <span className="font-medium">{categoria}</span>
                        <span className="text-sm text-gray-500">
                            {cantidad} productos
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-sm font-medium">
                            ${categoryTotal.toLocaleString()}
                        </span>
                        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </div>
                </button>

                {isExpanded && (
                    <div className="border-t bg-gray-50 p-4">
                        <div className="space-y-2">
                            {references.map((ref) => (
                                <div key={ref.referencia} className="flex items-center justify-between py-2">
                                    <div className="flex items-center gap-3">
                                        <Package className="h-4 w-4 text-gray-400" />
                                        <div>
                                            <p className="font-medium text-sm">{ref.nombre}</p>
                                            <p className="text-xs text-gray-500">Ref: {ref.referencia}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-medium">
                                            {ref.cantidad} unidades
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            ${ref.subtotal.toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    }, [expandedCategory, productos]);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">
                    Última actualización: {new Date(timestamp || '').toLocaleString()}
                </p>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRefresh}
                    disabled={isLoading}
                    className="gap-2"
                >
                    <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
                    <span>Actualizar</span>
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    {revenueData.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <TrendingUp className="h-5 w-5" />
                                    Ingresos Mensuales
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ChartComponent
                                    id="revenue-chart"
                                    primaryXAxis={{
                                        valueType: 'Category',
                                        title: 'Mes',
                                        labelIntersectAction: 'Rotate45',
                                        labelRotation: -45
                                    }}
                                    primaryYAxis={{
                                        title: 'Ingresos ($)',
                                        labelFormat: '${value}'
                                    }}
                                    tooltip={{ enable: true }}
                                    height="300px"
                                >
                                    <SeriesCollectionDirective>
                                        <SeriesDirective
                                            dataSource={revenueData}
                                            xName="x"
                                            yName="y"
                                            type="Line"
                                            marker={{
                                                visible: true,
                                                height: 10,
                                                width: 10,
                                                shape: 'Circle'
                                            }}
                                            fill="#000000"
                                        />
                                    </SeriesCollectionDirective>
                                </ChartComponent>
                            </CardContent>
                        </Card>
                    )}

                    <Card>
                        <CardHeader>
                            <CardTitle>🎯 Análisis por Categorías</CardTitle>
                            <p className="text-sm text-gray-500">
                                Click en cada categoría para ver detalles
                            </p>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {productos.distribucion.categorias.map(renderCategory)}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="h-5 w-5" />
                                    📄 Demo XML Generado
                                </CardTitle>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setXmlDemoOpen(!xmlDemoOpen)}
                                    className="gap-2"
                                >
                                    {xmlDemoOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                    <span>{xmlDemoOpen ? 'Ocultar' : 'Mostrar'} XML</span>
                                </Button>
                            </div>
                            <p className="text-sm text-gray-500">
                                {xmlDemo.metadata.productos_procesados} productos •
                                {new Date(xmlDemo.metadata.generado).toLocaleString()}
                            </p>
                        </CardHeader>
                        {xmlDemoOpen && (
                            <CardContent>
                                <pre className="bg-gray-50 p-4 rounded-lg text-xs overflow-x-auto max-h-96 overflow-y-auto font-mono">
                                    <code>{xmlDemo.contenido}</code>
                                </pre>
                            </CardContent>
                        )}
                    </Card>
                </div>

                <div className="space-y-6">
                    {insights.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>💡 Insights</CardTitle>
                            </CardHeader>
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
                                            <p className="text-gray-600 mt-1">
                                                {insight.mensaje}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}
{orders.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>🚀 Pedidos Recientes</CardTitle>
                                <p className="text-sm text-gray-500">Últimos pedidos</p>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {orders.slice(0, 5).map((order) => (
                                        <div key={order._id} className="flex items-center justify-between p-3 border rounded-lg">
                                            <div>
                                                <p className="font-medium text-sm">{order.orderNumber}</p>
                                                <p className="text-xs text-gray-500">
                                                    {new Date(order.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className={cn(
                                                    "px-2 py-1 text-xs rounded-full",
                                                    order.estado === 'pendiente' && "bg-yellow-100 text-yellow-800",
                                                    order.estado === 'procesando' && "bg-blue-100 text-blue-800",
                                                    order.estado === 'enviado' && "bg-purple-100 text-purple-800",
                                                    order.estado === 'entregado' && "bg-green-100 text-green-800"
                                                )}>
                                                    {order.estado}
                                                </span>
                                                <span className="font-medium text-sm">
                                                    ${order.totalPagado.toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                    <Card>
                        <CardHeader>
                            <CardTitle>📊 Resumen General</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="border-l-4 border-blue-500 pl-3">
                                    <p className="text-sm text-gray-500">Productos</p>
                                    <p className="text-xl font-bold">{productos.total}</p>
                                </div>
                                <div className="border-l-4 border-green-500 pl-3">
                                    <p className="text-sm text-gray-500">Valor Inventario</p>
                                    <p className="text-xl font-bold">${productos.valor.toLocaleString()}</p>
                                </div>
                                <div className="border-l-4 border-yellow-500 pl-3">
                                    <p className="text-sm text-gray-500">En Oferta</p>
                                    <p className="text-xl font-bold">{productos.oferta}</p>
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