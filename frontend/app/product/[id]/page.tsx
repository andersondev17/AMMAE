'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Spinner } from '@/components/ui/Spinner';
import { useCart } from '@/hooks/useCart';
import { Product } from '@/types';
import { getImageUrl } from '@/utils/demoImages';
import { ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ProductPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [mainImage, setMainImage] = useState<string>('');
  const { addItem } = useCart();
  const router = useRouter();

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner />
      </div>
    );
  }

  if (!product) {
    return null;
  }

  const handleAddToCart = () => {
    if (!selectedSize && product.tallas.length > 0) {
      alert('Por favor selecciona una talla');
      return;
    }
    if (!selectedColor && product.colores.length > 0) {
      alert('Por favor selecciona un color');
      return;
    }

    addItem(product);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Galería de imágenes */}
        <div className="space-y-4">
          <div className="aspect-square relative overflow-hidden rounded-lg bg-gray-100">
            <Image
              src={mainImage}
              alt={product.nombre}
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {product.imagenes.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setMainImage(getImageUrl(img))}
                className="aspect-square relative overflow-hidden rounded-md bg-gray-100"
              >
                <Image
                  src={getImageUrl(img)}
                  alt={`${product.nombre} vista ${idx + 1}`}
                  fill
                  className="object-cover hover:opacity-75 transition-opacity"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Información del producto */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{product.nombre}</h1>
            <p className="text-lg text-gray-600 mt-2">{product.categoria}</p>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-2xl font-bold text-gray-900">
              ${product.precio.toFixed(2)}
            </span>
            {product.enOferta && product.precioOferta && (
              <>
                <span className="text-xl text-gray-500 line-through">
                  ${product.precioOferta.toFixed(2)}
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
                <span className="text-sm text-gray-500">Guía de tallas</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {product.tallas.map((talla) => (
                  <Button
                    key={talla}
                    variant={selectedSize === talla ? "default" : "outline"}
                    onClick={() => setSelectedSize(talla)}
                    className="relative"
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
              <span className="text-sm font-medium text-gray-900">Color</span>
              <div className="flex flex-wrap gap-2">
                {product.colores.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`
                      w-10 h-10 rounded-full 
                      ${selectedColor === color ? 'ring-2 ring-blue-500 ring-offset-2' : 'ring-1 ring-gray-200'}
                    `}
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>
          )}

          <Separator />

          {/* Descripción y características */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Detalles</h3>
            <p className="text-gray-600">{product.descripcion}</p>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><strong>Material:</strong> {product.material}</li>
              <li><strong>Estilo:</strong> {product.estilo}</li>
              <li><strong>Disponibilidad:</strong> {product.stock} unidades</li>
            </ul>
          </div>

          {/* Botón de compra */}
          <Button
            onClick={handleAddToCart}
            className="w-full py-6 text-lg"
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