import { ProductSize } from '@/types';
import { memo } from 'react';

interface ProductSizeSelectorProps {
    sizes: ProductSize[];
    selectedSize?: string;
    onSelectSize: (size: ProductSize) => void;
}

export const ProductSizeSelector = memo(({
    sizes,
    selectedSize,
    onSelectSize
}: ProductSizeSelectorProps) => {
    return (
        <div className="flex flex-wrap gap-2">
            {sizes.map((size) => (
                <button
                    key={size}
                    onClick={() => onSelectSize(size)}
                    className={`
                        px-3 py-1 text-sm font-medium rounded-md
                        transition-colors duration-200
                        ${selectedSize === size
                            ? 'bg-black text-white'
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                        }
                    `}
                >
                    {size}
                </button>
            ))}
        </div>
    );
});

ProductSizeSelector.displayName = 'ProductSizeSelector';