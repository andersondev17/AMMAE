'use client';
import ErrorBoundary from '@/components/ErrorBoundary';
import { Skeleton } from '@/components/ui';
import { Button } from '@/components/ui/button';
import { mainCategories } from '@/constants';
import { useProducts } from '@/hooks/product/useProducts';
import { cn } from '@/lib/utils';
import { PRODUCT_CATEGORIES, ProductCategory } from '@/types/index';
import { Home } from 'lucide-react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { notFound, usePathname } from 'next/navigation';

const ProductList = dynamic(() => import('@/components/product/ProductList').then(m => m.ProductList), { loading: () => <Skeleton />, ssr: false });

export default function CategoryPage({ params }: { params: { categoria: string } }) {
  const normalizedCategory = params.categoria.charAt(0).toUpperCase() + params.categoria.slice(1).toLowerCase() as ProductCategory;
  const pathname = usePathname();

  if (!PRODUCT_CATEGORIES.includes(normalizedCategory)) notFound();

  const { products, isLoading, error, totalCount } = useProducts({
    categoria: normalizedCategory,
    limit: 12,
    sortBy: '-createdAt'
  });

  return (
    <ErrorBoundary fallback={<div className="text-center py-16 text-red-500">Error al cargar productos</div>}>
      <main className="container mx-auto px-4 py-8 pt-2">
        <div className='pt-10 pl-2'>
          <h1 className="text-2xl font-robert-regular font-bold mb-2">{normalizedCategory}</h1>
          {!isLoading && <p className="text-gray-600 mb-6">{totalCount} productos</p>}
        
        {/* Category Navigation */}
          <div className="flex flex-wrap gap-2 mb-8">
            <Link href="/"><Button variant="outline" size="sm"><Home className="w-4 h-4 mr-1" />Inicio</Button></Link>
            {mainCategories.map(({ name, path }) => (
              <Link key={name} href={path}>
                <Button
                  variant={pathname === path ? "default" : "outline"}
                  size="sm"
                  className={cn(pathname === path && "bg-black text-white font-general")}
                >
                {name.charAt(0) + name.slice(1).toLowerCase()}
              </Button>
            </Link>
          ))}
        </div>
        </div>
        <ProductList products={products} isLoading={isLoading} error={error} isAdminView={false} />
      </main>
    </ErrorBoundary>
  );
}