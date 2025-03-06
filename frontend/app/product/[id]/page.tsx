'use client';

import ProductHeader from '@/components/product/ProductHeader';
import VariantSelectors from '@/components/product/VariantSelectors';
import { ProductSkeleton } from '@/components/skeletons/ProductSkeleton';
import { BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, Breadcrumb, Button, Skeleton } from '@/components/ui/index';
import QuantitySelector from '@/components/ui/QuantitySelector';
import { useCart } from '@/hooks/cart/useCart';
import { Product } from '@/types';
import { getImageUrl } from '@/utils/demoImages';
import { ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Suspense, lazy, memo, useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

const ProductRecommendations = lazy(() => import('@/components/product/ProductRecommendations'));
const ProductGallery = lazy(() => import('@/components/product/ProductGallery'));
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

          <div className="grid grid-cols-4 gap-3 pt-2">
            <Button
              onClick={handleAddToCart}
              className="md:col-span-7 py-6 text-base"
              disabled={product.stock === 0}
            >
              <ShoppingBag className="mr-2 h-5 w-5" />
              {product.stock === 0 ? 'Agotado' : 'Agregar al carrito'}
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

