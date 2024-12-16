import { memo } from 'react';

export const ProductSkeleton = memo(() => (
    <div className="group relative h-full animate-pulse">
        {/* Skeleton para la imagen */}
        <div className="relative aspect-[3/4] w-full overflow-hidden border bg-gray-200">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" />
        </div>

        {/* Skeleton para la información */}
        <div className="p-4 space-y-3">
            {/* Título */}
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            {/* Estilo */}
            <div className="h-3 bg-gray-200 rounded w-1/2" />
            {/* Precio */}
            <div className="flex items-center gap-2">
                <div className="h-4 bg-gray-200 rounded w-20" />
            </div>
        </div>
    </div>
));

ProductSkeleton.displayName = 'ProductSkeleton';