'use client';

import { ProductSkeleton } from '@/components/skeletons/ProductSkeleton';
import { BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Badge,
  Breadcrumb,
  Button,
  Skeleton
} from '@/components/ui/index';
import { useCart } from '@/hooks/cart/useCart';
import { Product } from '@/types';
import { getImageUrl } from '@/utils/demoImages';
import { Heart, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Suspense, lazy, memo, useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

const ProductRecommendations = lazy(() => import('@/components/product/ProductRecommendations'));
const ProductGallery = lazy(() => import('@/components/product/ProductGallery'));

const COLOR_MAP = {
  'Negro': '#000000',
  'Blanco': '#FFFFFF',
  'Azul': '#2563EB',
  'Rojo': '#DC2626',
  'Verde': '#059669',
  'Amarillo': '#CA8A04',
  'Morado': '#7C3AED',
  'Rosa': '#DB2777',
  'Gris': '#4B5563',
  'Beige': '#D4B89C'
} as const;

export default function ProductPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const { addItem } = useCart();
  const router = useRouter();

  useEffect(() => {
    const controller = new AbortController();

    const fetchProduct = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/productos/${params.id}`,
          { signal: controller.signal }
        );

        if (!response.ok) throw new Error('Producto no encontrado');

        const { data } = await response.json();
        setProduct(data);
      } catch (error) {
        if (!(error instanceof DOMException && error.name === 'AbortError')) {
          router.push('/404');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
    return () => controller.abort();
  }, [params.id, router]);

  const handleAddToCart = useCallback(() => {
    if (!product) return;

    const errors = [];
    if (!selectedSize && product.tallas.length) errors.push('selecciona una talla');
    if (!selectedColor && product.colores.length) errors.push('selecciona un color');

    if (errors.length) {
      toast.error(`Por favor ${errors.join(' y ')}`);
      return;
    }

    addItem(product, { size: selectedSize, color: selectedColor, quantity });

    toast.success(
      <div className="flex items-center gap-2">
        <div className="relative h-10 w-10 rounded overflow-hidden">
          <Image
            src={getImageUrl(product.imagenes[0])}
            alt={product.nombre}
            fill
            className="object-cover"
          />
        </div>
        <div>
          <p className="font-medium">{product.nombre}</p>
          <p className="text-xs">Agregado al carrito</p>
        </div>
      </div>
    );
  }, [product, selectedSize, selectedColor, quantity, addItem]);

  const discountPercentage = useMemo(() =>
    product?.enOferta && product.precioOferta
      ? Math.round(((product.precio - product.precioOferta) / product.precio) * 100)
      : 0
    , [product]);

  if (isLoading) return <ProductSkeleton />;
  if (!product) return null;

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-8 py-24">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Inicio</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />

          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href={`/categoria/${product.categoria}`} >{product.categoria}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />

            <BreadcrumbItem>
              <BreadcrumbLink>{product.nombre}</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </BreadcrumbList>
      </Breadcrumb>


      <div className="grid md:grid-cols-2 gap-8">
        <Suspense fallback={<Skeleton className="aspect-square" />}>
          <ProductGallery product={product} />
        </Suspense>

        <div className="space-y-6">
          <ProductHeader product={product} discount={discountPercentage} />

          <VariantSelectors
            product={product}
            selectedSize={selectedSize}
            selectedColor={selectedColor}
            onSizeChange={setSelectedSize}
            onColorChange={setSelectedColor}
          />

          <QuantitySelector
            quantity={quantity}
            stock={product.stock}
            onQuantityChange={setQuantity}
          />

          <div className="grid grid-cols-1 md:grid-cols-10 gap-3 pt-2">
            <Button
              onClick={handleAddToCart}
              className="md:col-span-7 py-6 text-base"
              disabled={product.stock === 0}
            >
              <ShoppingBag className="mr-2 h-5 w-5" />
              {product.stock === 0 ? 'Agotado' : 'Agregar al carrito'}
            </Button>

            <Button variant="outline" className="md:col-span-3 py-6">
              <Heart className="h-5 w-5" />
            </Button>
          </div>

          <ProductAccordions product={product} />
        </div>
      </div>

      <Suspense fallback={<Skeleton className="h-96" />}>
        <ProductRecommendations
          categoryId={product.categoria}
          currentProductId={product._id}
        />
      </Suspense>
    </div>
  );
}

// Componentes secundarios
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

const VariantSelectors = memo(({
  product,
  selectedSize,
  selectedColor,
  onSizeChange,
  onColorChange
}: {
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
            const colorValue = COLOR_MAP[color as keyof typeof COLOR_MAP] || color;
            return (
              <button
                key={color}
                onClick={() => onColorChange(color)}
                className={`w-10 h-10 rounded-full border-2 ${selectedColor === color
                  ? 'border-primary scale-110'
                  : 'border-transparent hover:scale-105'
                  } ${colorValue === '#FFFFFF' ? 'bg-gray-100' : ''}`}
                style={{ backgroundColor: colorValue }}
                aria-label={`Color ${color}`}
              />
            );
          })}
        </div>
      </div>
    )}
  </>
));

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

const ProductAccordions = memo(({ product }: { product: Product }) => (
  <Accordion type="multiple" defaultValue={['details']}>
    <AccordionItem value="details">
      <AccordionTrigger>Detalles del producto</AccordionTrigger>
      <AccordionContent>
        <p>{product.descripcion}</p>
        <ul className="space-y-2 mt-2 text-sm">
          <li><strong>Material:</strong> {product.material}</li>
          <li><strong>Estilo:</strong> {product.estilo}</li>
        </ul>
      </AccordionContent>
    </AccordionItem>

    <AccordionItem value="shipping">
      <AccordionTrigger>Envío y entrega</AccordionTrigger>
      <AccordionContent>
        Envío gratuito a partir de $99. Entrega estimada de 3-5 días hábiles.
      </AccordionContent>
    </AccordionItem>

    <AccordionItem value="returns">
      <AccordionTrigger>Devoluciones</AccordionTrigger>
      <AccordionContent>
        Tienes 30 días para devolver el producto sin cargo adicional.
      </AccordionContent>
    </AccordionItem>
  </Accordion>
));

const StockStatus = memo(({ stock }: { stock: number }) => (
  <div className={`text-sm font-medium ${stock > 10 ? 'text-green-600' :
    stock > 0 ? 'text-orange-600' : 'text-destructive'
    }`}>
    {stock > 10 ? 'En stock' :
      stock > 0 ? `¡Últimas ${stock} unidades!` : 'Agotado'}
  </div>
));