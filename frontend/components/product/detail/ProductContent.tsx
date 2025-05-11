// components/product/ProductContent.tsx
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import QuantitySelector from '@/components/ui/QuantitySelector';
import { useCart } from '@/hooks/cart/useCart';
import { Product, ProductSize } from '@/types/product.types';
import { Heart, ShoppingBag } from 'lucide-react';
import { memo, useCallback, useState } from 'react';
import { toast } from 'sonner';
import ProductHeader from './ProductHeader';
import VariantSelectors from './VariantSelectors';

interface ProductContentProps {
  product: Product;
  discount: number;
}

const ProductContent = memo(({ product, discount }: ProductContentProps) => {
  const [selectedSize, setSelectedSize] = useState<ProductSize | ''>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [isWishlist, setIsWishlist] = useState(false);

  const { addItem } = useCart();

  // Selección de talla
  const handleSizeChange = useCallback((size: string) => {
    setSelectedSize(size as ProductSize);
  }, []);

  // Selección de color
  const handleColorChange = useCallback((color: string) => {
    setSelectedColor(color);
  }, []);

  // Cambio de cantidad
  const handleQuantityChange = useCallback((qty: number) => {
    setQuantity(qty);
  }, []);

  // Toggle wishlist
  const toggleWishlist = useCallback(() => {
    setIsWishlist(!isWishlist);
    toast.success(isWishlist ? 'Eliminado de favoritos' : 'Añadido a favoritos');
  }, [isWishlist]);

  // Añadir al carrito
  const handleAddToCart = useCallback(() => {
    if (!selectedSize && product.tallas?.length > 0) {
      toast.error('Por favor selecciona una talla');
      return;
    }

    if (!selectedColor && product.colores?.length > 0) {
      toast.error('Por favor selecciona un color');
      return;
    }

    addItem(product, {
      size: selectedSize,
      color: selectedColor,
      quantity
    });

    toast.success('Producto añadido al carrito');
  }, [product, selectedSize, selectedColor, quantity, addItem]);

  return (
    <div className="space-y-8">
      <ProductHeader product={product} discount={discount} />

      <VariantSelectors
        product={product}
        selectedSize={selectedSize}
        selectedColor={selectedColor}
        onSizeChange={handleSizeChange}
        onColorChange={handleColorChange}
      />

      <div className="space-y-6">
        <QuantitySelector
          quantity={quantity}
          stock={product.stock}
          onQuantityChange={handleQuantityChange}
        />

        <div className="flex gap-4">
          <Button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="flex-1 h-12 bg-black hover:bg-gray-900 text-white"
          >
            <ShoppingBag className="mr-2 h-5 w-5" />
            {product.stock === 0 ? 'Agotado' : 'Agregar al carrito'}
          </Button>
          
          <Button
            onClick={toggleWishlist}
            variant="outline"
            className="h-12 border-gray-300 hover:bg-gray-50"
            aria-label="Añadir a favoritos"
          >
            <Heart className={`h-5 w-5 ${isWishlist ? 'fill-red-500 text-red-500' : ''}`} />
          </Button>
        </div>
      </div>

      <Accordion type="single" collapsible className="mt-8 border-t border-gray-100 pt-4">
        <AccordionItem value="details" className="border-b border-gray-100">
          <AccordionTrigger className="py-4 text-sm font-medium">
            Detalles del producto
          </AccordionTrigger>
          <AccordionContent className="text-sm text-gray-600">
            <p className="mb-4">{product.descripcion}</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="font-medium text-black">Material:</span> {product.material}
              </div>
              <div>
                <span className="font-medium text-black">Estilo:</span> {product.estilo}
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="shipping" className="border-b border-gray-100">
          <AccordionTrigger className="py-4 text-sm font-medium">
            Envío y entrega
          </AccordionTrigger>
          <AccordionContent className="text-sm text-gray-600">
            <p>Envío gratuito a partir de $99. Entrega estimada de 3-5 días hábiles.</p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="returns" className="border-b border-gray-100">
          <AccordionTrigger className="py-4 text-sm font-medium">
            Devoluciones
          </AccordionTrigger>
          <AccordionContent className="text-sm text-gray-600">
            <p>Tienes 30 días para devolver el producto sin cargo adicional.</p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
});

ProductContent.displayName = 'ProductContent';

export default ProductContent;