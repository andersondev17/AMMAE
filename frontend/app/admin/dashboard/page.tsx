// app/admin/dashboard/page.tsx
'use client';

import { StatsCard } from "@/components/admin/cards/StatsCard";
import { ProductsCard } from "@/components/admin/products/ProductsCard";
import { Button } from "@/components/ui/button";
import { useDashboard } from "@/hooks/useDashboard";
import { formatPrice } from "@/lib/utils";
import { BarChart, DollarSign, Package, RefreshCw, Users } from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
    const {
        stats,
        pedidosRecientes,
        productosDestacados,
        isLoading,
        refreshDashboard
    } = useDashboard();

    // Formatear para presentación
    const formatChange = (value: number) => {
        if (value === 0) return "";
        const sign = value > 0 ? "+" : "";
        return `${sign}${value.toFixed(1)}%`;
    };

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            {/* Header con botón de actualización */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-medium tracking-tight">Dashboard</h1>
                    <p className="text-gray-500 mt-1">Vista general de tu tienda AMMAE</p>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => refreshDashboard()}
                    disabled={isLoading}
                >
                    <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                    Actualizar
                </Button>
            </div>

            {/* Tarjetas de estadísticas */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <StatsCard
                    title="Ingresos"
                    value={formatPrice(stats.ingresos.total.toString())}
                    description={formatChange(stats.ingresos.change)}
                    icon={<DollarSign className="h-5 w-5" />}
                    trend={stats.ingresos.change >= 0 ? 'up' : 'down'}
                    className="border border-gray-100 hover:border-black transition-colors duration-300"
                />
                <StatsCard
                    title="Pedidos"
                    value={stats.pedidos.total.toString()}
                    description={formatChange(stats.pedidos.change)}
                    icon={<BarChart className="h-5 w-5" />}
                    trend={stats.pedidos.change >= 0 ? 'up' : 'down'}
                    className="border border-gray-100 hover:border-black transition-colors duration-300"
                />
                <StatsCard
                    title="Productos"
                    value={stats.productos.total.toString()}
                    description={`${stats.productos.enStock} en stock`}
                    icon={<Package className="h-5 w-5" />}
                    trend="neutral"
                    className="border border-gray-100 hover:border-black transition-colors duration-300"
                />
                <StatsCard
                    title="Clientes"
                    value={stats.clientes.total.toString()}
                    description={formatChange(stats.clientes.change)}
                    icon={<Users className="h-5 w-5" />}
                    trend={stats.clientes.change >= 0 ? 'up' : 'down'}
                    className="border border-gray-100 hover:border-black transition-colors duration-300"
                />
            </div>

            {/* Productos destacados */}
            <div className="mt-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-medium">Productos destacados</h2>
                    <Link
                        href="/admin/products"
                        className="text-sm font-medium px-4 py-2 border border-black hover:bg-black hover:text-white transition-colors duration-300"
                    >
                        Ver todos los productos
                    </Link>
                </div>

                <div className="border border-gray-100 rounded-none overflow-hidden">
                    <ProductsCard
                        title=""
                        products={productosDestacados}
                        isLoading={isLoading}
                        className="shadow-none border-0"
                        emptyState={
                            <div className="py-10 px-4 text-center">
                                <p className="text-gray-500 mb-4">No hay productos para mostrar</p>
                                <Link
                                    href="/admin/products?new=true"
                                    className="inline-block text-sm font-medium px-4 py-2 bg-black text-white hover:bg-gray-800 transition-colors duration-300"
                                >
                                    Agregar producto
                                </Link>
                            </div>
                        }
                    />
                </div>
            </div>

            {/* Pedidos recientes */}
            {/* Pedidos recientes */}
            <div className="border border-gray-100 p-6 hover:border-black transition-colors duration-300">
                <h3 className="font-medium mb-4">Pedidos recientes</h3>
                <div className="space-y-4">
                    {isLoading ? (
                        Array(5).fill(0).map((_, i) => (
                            <div key={i} className="flex justify-between pb-3 border-b border-gray-100 animate-pulse">
                                <div>
                                    <div className="h-4 w-32 bg-gray-200 rounded"></div>
                                    <div className="h-3 w-24 bg-gray-200 rounded mt-2"></div>
                                </div>
                                <div className="h-6 w-16 bg-gray-200 rounded"></div>
                            </div>
                        ))
                    ) : pedidosRecientes?.length === 0 ? (
                        <p className="text-center text-gray-500 py-4">No hay pedidos recientes</p>
                    ) : (
                        pedidosRecientes.map((pedido) => (
                            <div key={pedido._id || `order-${Math.random()}`} className="flex justify-between pb-3 border-b border-gray-100">
                                <div>
                                    <p className="font-medium">{pedido.orderNumber || `Pedido #${pedido._id?.slice(-6) || '000000'}`}</p>
                                    <p className="text-sm text-gray-500">
                                        {pedido.customerData?.nombre || 'Cliente'}
                                    </p>
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className={`px-2 py-1 text-xs rounded capitalize ${pedido.estado === 'entregado' ? 'bg-green-100 text-green-800' :
                                            pedido.estado === 'cancelado' ? 'bg-red-100 text-red-800' :
                                                'bg-blue-100 text-blue-800'
                                        }`}>
                                        {pedido.estado || 'pendiente'}
                                    </span>
                                    <span className="text-sm font-medium mt-1">
                                        {formatPrice((pedido.totalPagado || 0).toString())}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}