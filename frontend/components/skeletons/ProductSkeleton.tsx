'use client';

import { Skeleton } from '@/components/ui/skeleton';

export const ProductSkeleton = () => (
    <div className="max-w-7xl mx-auto p-4 space-y-8">
        <Skeleton className="h-4 w-1/4" />
        <div className="grid md:grid-cols-2 gap-8">
            <Skeleton className="aspect-square" />
            <div className="space-y-6">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-32 w-full" />
            </div>
        </div>
    </div>
);

ProductSkeleton.displayName = 'ProductSkeleton';