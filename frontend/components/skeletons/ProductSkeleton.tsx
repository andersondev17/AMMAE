// components/skeletons/ProductSkeleton.tsx
import { Skeleton } from '@/components/ui/skeleton';

interface ProductSkeletonProps {
    count?: number;
}

export const ProductSkeleton = ({ count = 8 }: ProductSkeletonProps) => (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-0 border-l border-t">
        {Array.from({ length: count }, (_, i) => (
            <div key={i} className="border-r border-b p-4">
                <Skeleton className="w-full aspect-square mb-4" />
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-3 w-1/2 mb-2" />
                <Skeleton className="h-4 w-1/3" />
            </div>
        ))}
    </div>
);