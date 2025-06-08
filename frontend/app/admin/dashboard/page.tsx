'use client';

import { StatsCard } from "@/components/admin/cards/StatsCard";
import { Button } from "@/components/ui/button";
import { useXMLAnalytics } from "@/hooks/useXMLAnalytics";
import { formatPrice } from "@/lib/utils";
import { BarChart, DollarSign, Package, RefreshCw, Users } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";

// ✅ DYNAMIC IMPORT FOR HEAVY ANALYTICS COMPONENT
const XMLAnalyticsDashboard = dynamic(
    () => import('@/components/admin/XMLAnalyticsDashboard'),
    {
        ssr: false,
        loading: () => (
            <div className="space-y-6">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-48 mb-4"></div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-6">
                            <div className="h-64 bg-gray-200 rounded"></div>
                            <div className="h-96 bg-gray-200 rounded"></div>
                        </div>
                        <div className="space-y-6">
                            <div className="h-48 bg-gray-200 rounded"></div>
                            <div className="h-32 bg-gray-200 rounded"></div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
);

// ✅ LOADING SKELETON FOR MAIN DASHBOARD
const LoadingSkeleton = () => (
    <div className="space-y-8 max-w-7xl mx-auto">
        <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-48"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array(4).fill(0).map((_, i) => (
                <div key={i} className="border p-6 animate-pulse">
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </div>
            ))}
        </div>
    </div>
);

// ✅ ERROR COMPONENT
const ErrorDisplay = ({ error, onRetry }: { error: any; onRetry: () => void }) => (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="text-center">
            <h2 className="text-xl font-semibold mb-2 text-red-600">Error en Dashboard</h2>
            <p className="text-gray-600 mb-4">{error?.message || 'Error desconocido'}</p>
            <Button onClick={onRetry} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Reintentar
            </Button>
        </div>
    </div>
);

// ✅ MAIN DASHBOARD COMPONENT
export default function AdminDashboard() {
    const { stats, pedidosRecientes, productosDestacados, analytics, isLoading, error, refreshDashboard } = useXMLAnalytics();

    if (isLoading) return <LoadingSkeleton />;
    if (error) return <ErrorDisplay error={error} onRetry={refreshDashboard} />;

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-medium font-robert-regular">Dashboard AMMAE</h1>
                    <p className="text-gray-500 font-general">Vista general</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={refreshDashboard}>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Actualizar
                    </Button>
                    <Link href="/admin/products">
                        <Button size="sm">
                            <Package className="h-4 w-4 mr-2" />
                            Productos
                        </Button>
                    </Link>
                </div>
            </div>

            {/* ✅ KPI CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    title="Ingresos"
                    value={formatPrice(stats.ingresos.total.toString())}
                    icon={<DollarSign className="h-5 w-5" />}
                    description={`${stats.ingresos.change}% en los últimos 30 días`}
                    trend="neutral"
                />
                <StatsCard
                    title="Pedidos"
                    value={stats.pedidos.total.toString()}
                    icon={<BarChart className="h-5 w-5" />}
                    description={`${stats.pedidos.change}% en los últimos 30 días`}
                    trend="neutral"
                />
                <StatsCard
                    title="Productos"
                    value={stats.productos.total.toString()}
                    description={`${stats.productos.enStock} en stock`}
                    icon={<Package className="h-5 w-5" />}
                    trend="neutral"
                />
                <StatsCard
                    title="Clientes"
                    value={stats.clientes.total.toString()}
                    description={`${stats.clientes.change}% en los últimos 30 días`}
                    icon={<Users className="h-5 w-5" />}
                    trend="neutral"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border p-6 rounded-lg">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-medium font-robert-medium">Productos por Categoría</h2>
                        <Link href="/admin/products" className="text-sm border px-3 py-1 hover:bg-gray-50 rounded">
                            Ver todos
                        </Link>
                    </div>
                    <div className="space-y-3 font-general">
                        {productosDestacados.length > 0 ? (
                            productosDestacados.map(([categoria, cantidad]) => (
                                <div key={categoria} className="flex justify-between items-center">
                                    <span className="font-medium">{categoria}</span>
                                    <span className="text-sm bg-gray-100 px-2 py-1 rounded">
                                        {cantidad} productos
                                    </span>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 py-4">No hay datos de categorías</p>
                        )}
                    </div>
                </div>

                {/* Pedidos Recientes */}
                <div className="border p-6 rounded-lg">
                    <h3 className="text-xl font-medium mb-4 font-robert-medium">Pedidos Recientes</h3>
                    <div className="space-y-3 font-general">
                        {pedidosRecientes.length > 0 ? (
                            pedidosRecientes.map((pedido) => (
                                <div key={pedido.orderNumber} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
                                    <div>
                                        <p className="font-medium text-sm">{pedido.orderNumber}</p>
                                        <p className="text-xs text-gray-500">
                                            {pedido.customerData?.nombre || 'Cliente'}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <span className={`px-2 py-1 text-xs rounded ${pedido.estado === 'entregado' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                                            }`}>
                                            {pedido.estado}
                                        </span>
                                        <p className="text-xs font-medium mt-1">
                                            {formatPrice(pedido.totalPagado.toString())}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 py-4">No hay pedidos recientes</p>
                        )}
                    </div>
                </div>
            </div>

            {/* ✅ DETAILED ANALYTICS COMPONENT */}
            {analytics && (
                <div className="border-t pt-8">
                    <XMLAnalyticsDashboard />
                </div>
            )}
        </div>
    );
}