// components/product/ProductBreadcrumb.tsx
import { Product } from '@/types';
import Link from 'next/link';
import { memo } from 'react';

export const ProductBreadcrumb = memo(({ product }: { product: Product }) => (
    <nav className="flex text-sm" aria-label="Breadcrumb">
        <ol className="inline-flex items-center">
            <li>
                <Link href="/" className="text-gray-500 hover:text-gray-700">Inicio</Link>
            </li>
            <li className="mx-2 text-gray-400">/</li>
            <li>
                <Link href={`/categoria/${product.categoria.toLowerCase()}`} className="text-gray-500 hover:text-gray-700">
                    {product.categoria}
                </Link>
            </li>
            <li className="mx-2 text-gray-400">/</li>
            <li className="text-gray-900">{product.nombre}</li>
        </ol>
    </nav>
));

ProductBreadcrumb.displayName = 'ProductBreadcrumb';