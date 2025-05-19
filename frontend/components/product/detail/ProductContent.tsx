// components/product/ProductContent.tsx (optimizado)
import { Button } from '@/components/ui/button';
import DynamicAccordion from '@/components/ui/DynamicAccordion';
import QuantitySelector from '@/components/ui/QuantitySelector';
import { useCart } from '@/hooks/cart/useCart';
import { Product } from '@/types/product.types';
import { Heart, ShoppingBag } from 'lucide-react';
import { memo, useCallback, useMemo, useState } from 'react';
import { toast } from 'sonner';
import ProductHeader from './ProductHeader';
import VariantSelectors from './VariantSelectors';

const ProductContent = memo(({ product, discount }: { product: Product; discount: number }) => {
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isWishlist, setIsWishlist] = useState(false);
  const { addItem } = useCart();

  // Preparar datos de acordeón (memoizados para evitar recálculos)
  const accordionItems = useMemo(() => [
    {
      value: "details",
      title: "Detalles del producto",
      content: (
        <>
          <p className="mb-4">{product.descripcion}</p>
          <div className="grid grid-cols-2 gap-4">
            <div><span className="font-medium text-black">Material:</span> {product.material}</div>
            <div><span className="font-medium text-black">Estilo:</span> {product.estilo}</div>
          </div>
        </>
      )
    },
    {
      value: "shipping",
      title: "Envío y entrega",
      content: <p>Envío gratuito a partir de $99. Entrega estimada de 3-5 días hábiles.</p>
    },
    {
      value: "returns",
      title: "Devoluciones",
      content: <p>Tienes 30 días para devolver el producto sin cargo adicional.</p>
    }
  ], [product]);

  // Optimizar callbacks con parámetros específicos
  const handleSizeChange = useCallback((size: string) => setSelectedSize(size), []);
  const handleColorChange = useCallback((color: string) => setSelectedColor(color), []);
  const handleQuantityChange = useCallback((qty: number) => setQuantity(qty), []);

  const toggleWishlist = useCallback(() => {
    setIsWishlist(prev => !prev);
    toast.success(!isWishlist ? 'Añadido a favoritos' : 'Eliminado de favoritos');
  }, [isWishlist]);

  const handleAddToCart = useCallback(() => {
    // Validaciones
    if (!selectedSize && product.tallas?.length > 0) {
      toast.error('Por favor selecciona una talla');
      return;
    }

    if (!selectedColor && product.colores?.length > 0) {
      toast.error('Por favor selecciona un color');
      return;
    }

    // Añadir al carrito
    addItem(product, { size: selectedSize, color: selectedColor, quantity });
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

      <DynamicAccordion
        items={accordionItems}
        type="single"
        collapsible
        defaultValue="details"
        className="mt-6"
      />
    </div>
  );
});

ProductContent.displayName = 'ProductContent';
export default ProductContent;