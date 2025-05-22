import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/form/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { Product } from '@/types';
import { getProductImages } from '@/utils/demoImages';
import Image from 'next/image';
import Link from 'next/link';

interface ProductsCardProps {
    title: string;
    products: Product[];
    isLoading: boolean;
    className?: string;
    emptyState?: React.ReactNode;
}

export function ProductsCard({
    title,
    products,
    isLoading,
    className,
    emptyState
}: ProductsCardProps) {
    return (
        <Card className={cn("overflow-hidden", className)}>
            {title && (
                <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-medium font">{title}</CardTitle>
                </CardHeader>
            )}
            <CardContent className="p-0">
                {isLoading ? (
                    <div className="space-y-4 p-4">
                        {Array(3).fill(0).map((_, i) => (
                            <div key={i} className="flex items-center space-x-4">
                                <Skeleton className="h-12 w-12 rounded-md" />
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-[200px]" />
                                    <Skeleton className="h-3 w-[150px]" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : products?.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                        {emptyState || "No hay productos para mostrar"}
                    </div>
                ) : (
                    <div className="divide-y">
                        {products.map(product => {
                            const { primary: imageUrl } = getProductImages(product);
                            return (
                                <Link
                                    key={product._id}
                                    href={`/admin/products?edit=${product._id}`}
                                    className="flex items-center p-4 hover:bg-gray-50 transition-colors duration-300"
                                >
                                    <div className="w-12 h-12 rounded-none overflow-hidden mr-4 relative">
                                        <Image
                                            src={imageUrl}
                                            alt={product.nombre}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-medium font-robert-regular truncate">{product.nombre}</h4>
                                        <div className="flex items-center font-general text-sm text-gray-500">
                                            <span>${product.precio.toFixed(2)}</span>
                                            <span className="mx-2">•</span>
                                            <span>{product.categoria}</span>
                                        </div>
                                    </div>
                                    <div className={cn(
                                        "text-sm font-medium",
                                        product.stock <= 0 ? "text-red-700" :
                                            product.stock <= 5 ? "text-amber-700" :
                                                "text-green-700"
                                    )}>
                                        {product.stock <= 0 ? "Sin stock" :
                                            product.stock <= 5 ? "Bajo stock" :
                                                "En stock"}
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}