// components/skeletons/ProductSkeleton.tsx
import { memo } from 'react';

interface ProductSkeletonProps {
    count?: number;
}

export const ProductSkeleton = memo(({ count = 8 }: ProductSkeletonProps) => {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-0 border-l border-t">
            {Array.from({ length: count }).map((_, index) => (
                <div key={index} className="border-r border-b animate-pulse">
                    <div className="p-4">
                        <div className="aspect-[3/4] bg-gray-200 mb-4"></div>
                        <div className="space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
});

ProductSkeleton.displayName = 'ProductSkeleton';