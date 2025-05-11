// hooks/product/useProductById.ts
import { productService } from '@/services/productService';
import { Product } from '@/types';
import { useEffect, useState } from 'react';

export function useProductById(id: string) {
    const [product, setProduct] = useState<Product | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const controller = new AbortController();

        async function fetchProduct() {
            try {
                setIsLoading(true);
                const response = await productService.getProductById(id);
                setProduct(response.data);
                setError(null);
            } catch (err) {
                if (err instanceof Error && err.name !== 'AbortError') {
                    setError(err);
                }
            } finally {
                setIsLoading(false);
            }
        }

        fetchProduct();

        return () => controller.abort();
    }, [id]);

    return { product, isLoading, error };
}