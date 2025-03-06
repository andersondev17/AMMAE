import { memo } from "react";

const QuantitySelector = memo(({
    quantity,
    stock,
    onQuantityChange
}: {
    quantity: number;
    stock: number;
    onQuantityChange: (q: number) => void;
}) => (
    <div className="space-y-3">
        <span className="text-sm font-medium">Cantidad</span>
        <div className="flex items-center border rounded-md w-fit">
            <button
                onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
                className="w-10 h-10 flex items-center justify-center"
                disabled={quantity <= 1}
                aria-label="Disminuir cantidad"
            >
                -
            </button>
            <span className="w-10 h-10 flex items-center justify-center font-medium">
                {quantity}
            </span>
            <button
                onClick={() => onQuantityChange(Math.min(stock, quantity + 1))}
                className="w-10 h-10 flex items-center justify-center"
                disabled={quantity >= stock}
                aria-label="Aumentar cantidad"
            >
                +
            </button>
        </div>
    </div>
));

export default QuantitySelector;