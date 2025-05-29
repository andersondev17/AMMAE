'use client';

import { StatsCard } from "@/components/admin/cards/StatsCard";
import { DashboardSkeleton } from "@/components/skeletons/ProductSkeleton";
import { useXMLAnalytics } from "@/hooks/useXMLAnalytics";
import { Box, DollarSign, Package, ShoppingCart } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useMemo } from "react";

// Lazy load the dashboard XML
const XMLAnalyticsDashboard = dynamic(
    () => import('@/components/admin/XMLAnalyticsDashboard'),
    { ssr: false, loading: () => <DashboardSkeleton /> }
);

export default function EnterpriseDashboard() {
    const { analytics, isLoading, error } = useXMLAnalytics();

    // Extraer KPIs desde analytics
    const kpis = useMemo(() => {
        if (!analytics) return null;
        return {
            ingresos: analytics.ventas.porMes.reduce((sum, mes) => sum + mes.ingresos, 0),
            totalPedidos: analytics.ventas.porMes.reduce((sum, mes) => sum + mes.pedidos, 0),
            productosTotal: analytics.productos.total,
        };
    }, [analytics]);

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            <header className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-medium tracking-tight">Analytics Dashboard</h1>
                    <p className="text-gray-500 mt-1">AMMAE Store - Análisis Empresarial</p>
                </div>
                <Link
                    href="/admin/products"
                    className="px-4 py-2 bg-black text-white hover:bg-gray-800 transition-colors text-sm flex items-center gap-2"
                >
                    <Package className="h-4 w-4" />
                    Gestionar Productos
                </Link>
            </header>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {kpis && (
                    <>
                        <StatsCard
                            title="Ingresos"
                            value={`$${kpis.ingresos.toLocaleString()}`}
                            icon={<DollarSign className="h-4 w-4" />}
                        />
                        <StatsCard
                            title="Pedidos"
                            value={kpis.totalPedidos.toString()}
                            icon={<ShoppingCart className="h-4 w-4" />}
                        />
                        <StatsCard
                            title="Productos"
                            value={kpis.productosTotal.toString()}
                            icon={<Box className="h-4 w-4" />}
                        />
                    </>
                )}
            </div>

            {analytics && <XMLAnalyticsDashboard />}

        </div>
    );
}