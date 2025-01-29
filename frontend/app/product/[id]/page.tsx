'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/form/separator';
import { Spinner } from '@/components/ui/Spinner';
import { useCart } from '@/hooks/cart/useCart';
import { Product } from '@/types';
import { getImageUrl } from '@/utils/demoImages';
import { ChevronDown, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

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
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [mainImage, setMainImage] = useState<string>('');
  const { addItem } = useCart();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/productos/${params.id}`);
        if (!response.ok) throw new Error('Producto no encontrado');
        const data = await response.json();
        setProduct(data.data);
        setMainImage(getImageUrl(data.data.imagenes[0]));
      } catch (error) {
        console.error('Error fetching product:', error);
        router.push('/404');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [params.id, router]);

  const handleAddToCart = useCallback(() => {
    if (!product) return;

    if (!selectedSize && product.tallas.length > 0) {
      toast.error('Por favor selecciona una talla');
      return;
    }
    if (!selectedColor && product.colores.length > 0) {
      toast.error('Por favor selecciona un color');
      return;
    }

    // objeto de opciones
    const options = {
      size: selectedSize,
      color: selectedColor,
      quantity: 1
    };

    addItem(product, options);
    toast.success('Producto agregado al carrito');
  }, [product, selectedSize, selectedColor, addItem]);

  if (isLoading) return <div className="flex items-center justify-center min-h-[60vh]"><Spinner /></div>;
  if (!product) return null;

  return (
    <div className="container mx-auto max-w-7xl px-4 py-20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Galería de imágenes */}
        {/* Galería de imágenes */}
<div className="flex gap-4">
  {/* Miniaturas verticales */}
  <div className="flex flex-col gap-2 w-20">
    {product.imagenes.map((img, idx) => (
      <button
        key={idx}
        onClick={() => setMainImage(getImageUrl(img))}
        className={`
          relative aspect-square w-20 overflow-hidden rounded-md bg-gray-100
          hover:opacity-75 transition-opacity focus:ring-2 focus:ring-blue-500
          ${mainImage === getImageUrl(img) ? 'ring-2 ring-blue-500' : ''}
        `}
      >
        <Image
          src={getImageUrl(img)}
          alt={`${product.nombre} vista ${idx + 1}`}
          fill
          className="object-cover"
        />
      </button>
    ))}
  </div>

  {/* Imagen principal */}
  <div className="flex-1">
    <div className="aspect-square relative overflow-hidden rounded-lg bg-gray-100">
      <Image
        src={mainImage}
        alt={product.nombre}
        fill
        className="object-cover"
        priority
      />
    </div>
  </div>
</div>

        {/* Información del producto */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-sans text-gray-900">{product.nombre}</h1>
            <p className="text-lg text-gray-600 mt-2">{product.categoria}</p>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xl  text-red-600 font-medium">
              ${product.precio}
            </span>
            {product.enOferta && product.precioOferta && (
              <>
                <span className="text-xl text-gray-900 line-through">
                  ${product.precioOferta}
                </span>
                <Badge variant="destructive">
                  -{Math.round(((product.precio - product.precioOferta) / product.precio) * 100)}%
                </Badge>
              </>
            )}
          </div>

          <Separator />

          {/* Selector de tallas */}
          {product.tallas.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900">Talla</span>
                <span className="text-sm text-gray-500">
                  {selectedSize || 'Selecciona una talla'}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {Array.from(new Set(product.tallas)).map((talla) => (
                  <Button
                    key={`size-${talla}`}
                    variant={selectedSize === talla ? "default" : "outline"}
                    onClick={() => setSelectedSize(talla)}
                  >
                    {talla}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Selector de colores */}
          {product.colores.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900">Color</span>
                <span className="text-sm text-gray-500">
                  {selectedColor || 'Selecciona un color'}
                </span>
              </div>
              <div className="flex flex-wrap gap-3">
                {product.colores.map((color) => {
                  const colorValue = COLOR_MAP[color as keyof typeof COLOR_MAP] || color;
                  const isLight = ['#FFFFFF', '#D4B89C', '#CA8A04'].includes(colorValue);

                  return (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`
                        w-12 h-12 rounded-full transition-all
                        ${selectedColor === color ? 'ring-2 ring-blue-500 ring-offset-2 scale-105' : 'hover:scale-105'}
                        ${isLight ? 'border border-gray-200' : ''}
                      `}
                      style={{ backgroundColor: colorValue }}
                      title={color}
                    />
                  );
                })}
              </div>
            </div>
          )}

          <Separator />

          {/* Descripción y características */}
          <div className="space-y-4">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="w-full p-4 flex items-center justify-between hover:bg-gray-50"
            >
              <h3 className="text-lg font-medium">Detalles</h3>
              <ChevronDown className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            <div className={`overflow-hidden transition-all ${isOpen ? 'p-4' : 'h-0'}`}>
              <p className="text-gray-600">{product.descripcion}</p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><strong>Material:</strong> {product.material}</li>
                <li><strong>Estilo:</strong> {product.estilo}</li>
                <li>
                  <strong>Disponibilidad:</strong>{' '}
                  <span className={product.stock > 0 ? 'text-green-600' : 'text-red-600'}>
                    {product.stock > 0 ? `${product.stock} unidades disponibles` : 'Agotado'}
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Botón de compra */}
          <Button
            onClick={handleAddToCart}
            className="w-full py-6 text-lg "
            disabled={product.stock === 0}
          >
            <ShoppingBag className="mr-2 h-5 w-5" />
            {product.stock === 0 ? 'Agotado' : 'Agregar al carrito'}
          </Button>
        </div>
      </div>
    </div>
  );
}