import { Product } from "@/types/product.types";
import { memo } from "react";
import { Badge } from "../ui";

const StockStatus = memo(({ stock }: { stock: number }) => (
    <div className={`text-sm font-medium ${stock > 10 ? 'text-green-600' :
        stock > 0 ? 'text-orange-600' : 'text-destructive'
        }`}>
        {stock > 10 ? 'En stock' :
            stock > 0 ? `¡Últimas ${stock} unidades!` : 'Agotado'}
    </div>
));

const ProductHeader = memo(({ product, discount }: {
    product: Product;
    discount: number;
}) => (
    <div className="space-y-2">
        <h1 className="text-3xl font-bold">{product.nombre}</h1>
        <p className="text-lg text-muted-foreground">{product.categoria}</p>

        <div className="flex items-center gap-3">
            <span className="text-2xl font-bold">
                ${product.enOferta ? product.precioOferta?.toFixed(2) : product.precio.toFixed(2)}
            </span>
            {discount > 0 && <Badge variant="destructive">-{discount}%</Badge>}
            <StockStatus stock={product.stock} />
        </div>
    </div>
));

export default ProductHeader;


