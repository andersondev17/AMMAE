// app/admin/dashboard/page.tsx
'use client';

import { StatsCard } from "@/components/admin/cards/StatsCard";
import { ProductsCard } from "@/components/admin/products/ProductsCard";
import { useProducts } from "@/hooks/product/useProducts";
import { Product } from "@/types";
import { BarChart, DollarSign, Package, Users } from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
    const { products, isLoading, totalCount } = useProducts({ limit: 6, fields: '' });

    const productsInStock = isLoading 
        ? "Cargando..." 
        : `${products.filter((p: Product) => p.stock > 0).length} con inventario`;

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            {/* Header minimalista */}
            <div className="mb-8">
                <h1 className="text-3xl font-medium tracking-tight">Dashboard</h1>
                <p className="text-gray-500 mt-1">Vista general de tu tienda AMMAE</p>
            </div>

            {/* Stats Cards con estilo similar a Bershka */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <StatsCard
                    title="Ingresos"
                    value="$15,231.89"
                    description="+20% desde el mes pasado"
                    icon={<DollarSign className="h-5 w-5" />}
                    trend="up"
                    className="border border-gray-100 hover:border-black transition-colors duration-300"
                />
                <StatsCard
                    title="Ventas"
                    value="120"
                    description="+12% desde el mes pasado"
                    icon={<BarChart className="h-5 w-5" />}
                    trend="up"
                    className="border border-gray-100 hover:border-black transition-colors duration-300"
                />
                <StatsCard
                    title="Productos"
                    value={totalCount.toString()}
                    description={productsInStock}
                    icon={<Package className="h-5 w-5" />}
                    trend="neutral"
                    className="border border-gray-100 hover:border-black transition-colors duration-300"
                />
                <StatsCard
                    title="Clientes"
                    value="573"
                    description="+6% desde el mes pasado"
                    icon={<Users className="h-5 w-5" />}
                    trend="up"
                    className="border border-gray-100 hover:border-black transition-colors duration-300"
                />
            </div>

            {/* Sección de productos recientes con diseño limpio */}
            <div className="mt-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-medium">Productos más vendidos</h2>
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
                        products={products}
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

            {/* Sección de análisis actualizada con diseño limpio */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
                <div className="border border-gray-100 p-6 hover:border-black transition-colors duration-300 lg:col-span-2">
                    <h3 className="font-medium mb-4">Ventas mensuales</h3>
                    <div className="h-64 flex items-center justify-center bg-gray-50">
                        <p className="text-gray-400">Gráfico de ventas mensuales</p>
                    </div>
                </div>

                <div className="border border-gray-100 p-6 hover:border-black transition-colors duration-300">
                    <h3 className="font-medium mb-4">Pedidos recientes</h3>
                    <div className="space-y-4">
                        {/* Lista de pedidos recientes */}
                        {Array(5).fill(0).map((_, i) => (
                            <div key={i} className="flex justify-between pb-3 border-b border-gray-100">
                                <div>
                                    <p className="font-medium">Pedido #{1000 + i}</p>
                                    <p className="text-sm text-gray-500">Hace {i + 1} horas</p>
                                </div>
                                <span className="px-2 py-1 text-xs bg-gray-100">Completado</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}