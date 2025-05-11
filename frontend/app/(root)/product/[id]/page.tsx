// app/(root)/product/[id]/page.tsx
'use client';

import ProductDetail from '@/components/product/detail/ProductDetail';
import { ProductSkeleton } from '@/components/skeletons/ProductSkeleton';
import { useProductById } from '@/hooks/product/useProductById';
import { useRouter } from 'next/navigation';

export default function ProductPage({ params }: { params: { id: string } }) {
  const { product, isLoading, error } = useProductById(params.id);
  const router = useRouter();

  if (error) {
    router.push('/404');
    return null;
  }

  if (isLoading) {
    return <ProductSkeleton />;
  }

  if (!product) {
    return null;
  }

  return <ProductDetail product={product} />;
}