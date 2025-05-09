// components/product/ProductContent.tsx
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import QuantitySelector from '@/components/ui/QuantitySelector';
import { useCart } from '@/hooks/cart/useCart';
import { Product, ProductSize } from '@/types/product.types';
import { ShoppingBag } from 'lucide-react';
import { memo, useCallback, useState } from 'react';
import { toast } from 'sonner';
import ProductHeader from './ProductHeader';
import VariantSelectors from './VariantSelectors';

interface ProductContentProps {
  product: Product;
  discount: number;
}

const ProductContent = memo(({ product, discount }: ProductContentProps) => {
  // Tipado correcto para los estados
  const [selectedSize, setSelectedSize] = useState<ProductSize | ''>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);

  const { addItem } = useCart();

  // Handlers con tipado explícito
  const handleSizeChange = useCallback((size: string) => {
    // Convertimos el string a ProductSize para satisfacer el tipado
    setSelectedSize(size as ProductSize);
  }, []);

  const handleColorChange = useCallback((color: string) => {
    setSelectedColor(color);
  }, []);

  const handleQuantityChange = useCallback((qty: number) => {
    setQuantity(qty);
  }, []);

  // Handler para añadir al carrito
  const handleAddToCart = useCallback(() => {
    // Validar selecciones
    if (!selectedSize && product.tallas?.length > 0) {
      toast.error('Por favor selecciona una talla');
      return;
    }

    if (!selectedColor && product.colores?.length > 0) {
      toast.error('Por favor selecciona un color');
      return;
    }

    // Añadir al carrito
    addItem(product, {
      size: selectedSize,
      color: selectedColor,
      quantity
    });

    // Notificar éxito
    toast.success('Producto añadido al carrito');
  }, [product, selectedSize, selectedColor, quantity, addItem]);

  return (
    <div className="space-y-6">
      <ProductHeader product={product} discount={discount} />

      <VariantSelectors
        product={product}
        selectedSize={selectedSize}
        selectedColor={selectedColor}
        onSizeChange={handleSizeChange}
        onColorChange={handleColorChange}
      />

      <QuantitySelector
        quantity={quantity}
        stock={product.stock}
        onQuantityChange={handleQuantityChange}
      />

      <button
        onClick={handleAddToCart}
        disabled={product.stock === 0}
        className="w-full py-3 flex items-center justify-center font-medium rounded-md
                 bg-black text-white disabled:bg-gray-200 disabled:text-gray-500"
      >
        <ShoppingBag className="mr-2 h-5 w-5" />
        {product.stock === 0 ? 'Agotado' : 'Agregar al carrito'}
      </button>

      {/* Implementación del Accordion de shadcn/ui */}
      <Accordion type="multiple" defaultValue={['details']} className="mt-6">
        <AccordionItem value="details">
          <AccordionTrigger>Detalles del producto</AccordionTrigger>
          <AccordionContent>
            <div className="prose prose-sm max-w-none text-gray-700">
              <p>{product.descripcion}</p>
              <ul className="space-y-2 mt-2">
                <li><strong>Material:</strong> {product.material}</li>
                <li><strong>Estilo:</strong> {product.estilo}</li>
              </ul>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="shipping">
          <AccordionTrigger>Envío y entrega</AccordionTrigger>
          <AccordionContent>
            <p className="text-gray-700">
              Envío gratuito a partir de $99. Entrega estimada de 3-5 días hábiles.
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="returns">
          <AccordionTrigger>Devoluciones</AccordionTrigger>
          <AccordionContent>
            <p className="text-gray-700">
              Tienes 30 días para devolver el producto sin cargo adicional.
            </p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
});

ProductContent.displayName = 'ProductContent';

export default ProductContent;