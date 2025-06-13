import { Skeleton } from '@/components/ui/skeleton';
import { TableCell, TableRow } from '@/components/ui/table';

interface ProductSkeletonProps {
    count?: number;
    variant?: 'grid' | 'table';
}

const GridSkeleton = ({ count = 8 }: { count: number }) => (
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

export const TableSkeleton = ({ rows = 5 }: { rows: number }) => (
    <>
        {Array(rows).fill(0).map((_, i) => (
            <TableRow key={`skeleton-${i}`}>
                <TableCell><Skeleton className="h-10 w-10 rounded" /></TableCell>
                <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                <TableCell><Skeleton className="h-8 w-8 rounded-full" /></TableCell>
            </TableRow>
        ))}
    </>
);

export const ProductSkeleton = ({ count = 8, variant = 'grid' }: ProductSkeletonProps) => {
    return variant === 'grid' ? 
        <GridSkeleton count={count} /> : 
        <TableSkeleton rows={count} />;
};

// ✅ DASHBOARD SKELETON - UNCHANGED
export const DashboardSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array(4).fill(0).map((_, i) => (
            <div key={i} className="h-32 bg-gray-100 animate-pulse rounded-lg" />
        ))}
    </div>
);

// ✅ SPECIFIC EXPORTS FOR CONVENIENCE
export const ProductGridSkeleton = ({ count = 8 }: { count?: number }) => 
    <ProductSkeleton count={count} variant="grid" />;

export const ProductTableSkeleton = ({ rows = 5 }: { rows?: number }) => 
    <ProductSkeleton count={rows} variant="table" />;