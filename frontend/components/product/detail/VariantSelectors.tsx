import { COLOR_MAP } from "@/constants";
import { Product } from "@/types/product.types";
import { memo } from "react";
import { Button } from "../../ui";


const VariantSelectors = memo(({    product,    selectedSize,    selectedColor,    onSizeChange,    onColorChange}: {
    product: Product;
    selectedSize: string;
    selectedColor: string;
    onSizeChange: (size: string) => void;
    onColorChange: (color: string) => void;
}) => (
    <>
        {product.tallas.length > 0 && (
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Talla</span>
                    <Button
                        variant="link"
                        className="text-sm h-auto p-0"
                        onClick={() => window.open('/size-guide', '_blank')}
                    >
                        Guía de tallas
                    </Button>
                </div>

                <div className="grid grid-cols-4 gap-2">
                    {product.tallas.map((talla) => (
                        <Button
                            key={talla}
                            variant={selectedSize === talla ? 'default' : 'outline'}
                            onClick={() => onSizeChange(talla)}
                            className="h-12"
                        >
                            {talla}
                        </Button>
                    ))}
                </div>
            </div>
        )}

        {product.colores.length > 0 && (
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Color</span>
                    <span className="text-sm text-muted-foreground">
                        {selectedColor || 'Selecciona un color'}
                    </span>
                </div>

                <div className="flex flex-wrap gap-2">
                    {product.colores.map((color) => {
                        const colorValue = COLOR_MAP[color] || '#CCCCCC';
                        
                        return (
                            <button
                                key={color}
                                onClick={() => onColorChange(color)}
                                className={`w-10 h-10 rounded-full border-2 transition-transform ${
                                    selectedColor === color
                                        ? 'border-primary scale-110'
                                        : 'border-transparent hover:scale-105'
                                }`}
                                style={{ backgroundColor: colorValue }}
                                aria-label={`Color ${color}`}
                                title={color}
                            />
                        );
                    })}
                </div>
            </div>
        )}
    </>
));

export default VariantSelectors;