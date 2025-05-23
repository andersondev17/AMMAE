// components/product/ProductDetail.tsx - MODAL OPTIMIZADO SIGUIENDO PRINCIPIOS ITIL
'use client';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/cart/useCart';
import { Product } from '@/types';
import { getImageUrl } from '@/utils/demoImages';
import { Heart, ShoppingBag, X } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { toast } from 'sonner';
import ProductRecommendations from './ProductRecommendations';

const COLOR_MAP: Record<string, string> = {
    Negro: '#000', Blanco: '#fff', Azul: '#2563EB', Rojo: '#DC2626',
    Verde: '#059669', Amarillo: '#CA8A04', Morado: '#7C3AED', Rosa: '#DB2777',
    Gris: '#4B5563', Beige: '#D4B89C'
};

export default function ProductDetail({ product }: { product: Product }) {
    // Estados unificados (manteniendo lógica de negocio)
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedColor, setSelectedColor] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [mainImage, setMainImage] = useState(getImageUrl(product.imagenes[0]));
    const [isWishlist, setIsWishlist] = useState(false);
    const [expandedAccordion, setExpandedAccordion] = useState('details');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { addItem } = useCart();

    // Cálculos inline (conservando valor de negocio)
    const discount = product.enOferta && product.precioOferta
        ? Math.round(((product.precio - product.precioOferta) / product.precio) * 100)
        : 0;

    // Handlers (funcionalidad original conservada)
    const handleAddToCart = () => {
        if (!selectedSize && product.tallas?.length > 0) {
            toast.error('Por favor selecciona una talla');
            return;
        }
        if (!selectedColor && product.colores?.length > 0) {
            toast.error('Por favor selecciona un color');
            return;
        }
        addItem(product, { size: selectedSize, color: selectedColor, quantity });
        toast.success('Producto añadido al carrito');
    };

    return (
        <div className="max-w-full mx-auto pr-6 space-y-6 py-1">
            <div className="grid md:grid-cols-[2fr,1fr] gap-8">
                {/* Gallery con zoom - FUNCIONALIDAD ORIGINAL CONSERVADA */}
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div
                            className="aspect-[3/4] relative bg-gray-50 rounded-lg overflow-hidden cursor-pointer"
                            onClick={() => setIsModalOpen(true)}
                        >
                            <Image
                                src={mainImage}
                                alt={product.nombre}
                                width={1000}
                                height={500}
                                className="object-cover hover:opacity-90 transition-opacity"
                                priority
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 flex items-center justify-center transition-all duration-200 group">
                                <div className="opacity-0 group-hover:opacity-100 bg-white rounded-full p-3 flex items-center gap-2 text-sm font-medium font-general">
                                    <span className="text-2xl">+</span>
                                    <span>Ampliar</span>
                                </div>
                            </div>
                        </div>

                        {/* Segunda imagen - Solo en desktop */}
                        <div
                            className="aspect-[3/4] relative bg-gray-50 rounded-lg overflow-hidden hidden md:block cursor-pointer"
                            onClick={() => setIsModalOpen(true)}
                        >
                            <Image
                                src={getImageUrl(product.imagenes[1] || product.imagenes[0])}
                                alt={`${product.nombre} - Vista 2`}
                                width={1000}
                                height={500}
                                className="object-cover hover:opacity-90 transition-opacity"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 flex items-center justify-center transition-all duration-200 group">
                                <div className="opacity-0 group-hover:opacity-100 bg-white rounded-full p-3 flex items-center gap-2 text-sm font-medium font-general">
                                    <span className="text-2xl">+</span>
                                    <span>Ampliar</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Thumbnails - CONSERVADOS */}
                    <div className="grid grid-cols-5 gap-2">
                        {product.imagenes.map((img, idx) => (
                            <button
                                key={idx}
                                onClick={() => setMainImage(getImageUrl(img))}
                                className={`relative aspect-square overflow-hidden ${mainImage === getImageUrl(img)
                                    ? 'ring-2 ring-primary'
                                    : 'opacity-75 hover:opacity-100'
                                    }`}
                                aria-label={`Vista previa ${idx + 1}`}
                            >
                                <Image
                                    src={getImageUrl(img)}
                                    alt={`${product.nombre} - Vista ${idx + 1}`}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 20vw, 10vw"
                                />
                            </button>
                        ))}
                    </div>
                </div>

                {/* INFO SECTION - CONSERVADA COMPLETAMENTE */}
                <div className="space-y-8 pt-0 md:py-16 px-3 ">
                    <div className="space-y-4 md:space-y-0 md:grid md:grid-cols-2 md:gap-4">
                        <div>
                            <h1 className="text-2xl font-medium font-robert-medium">{product.nombre}</h1>
                            <p className="text-gray-500 mt-1 font-robert-regular">{product.categoria}</p>
                        </div>

                        <div className="flex items-baseline gap-4">
                            {discount > 0 ? (
                                <>
                                    <span className="text-2xl font-medium font-general">${product.precioOferta?.toFixed(2)}</span>
                                    <span className="text-gray-500 line-through text-sm font-general">${product.precio.toFixed(2)}</span>
                                    <span className="px-2 py-0.5 font-robert-general bg-red-100 text-red-700 text-xs font-medium">
                                        -{discount}% OFF
                                    </span>
                                </>
                            ) : (
                                <span className="text-2xl font-medium font-general">${product.precio.toFixed(2)}</span>
                            )}
                        </div>

                        <div className="flex items-center gap-2 text-sm font-robert-regular">
                            {product.stock === 0 ? (
                                <span className="text-red-600 font-medium">Agotado</span>
                            ) : product.stock <= 5 ? (
                                <span className="text-amber-600 font-medium">¡Solo {product.stock} en stock!</span>
                            ) : (
                                <span className="text-green-600 font-medium">En stock</span>
                            )}
                            {product.stock > 0 && (
                                <>
                                    <span className="text-gray-300">•</span>
                                    <span className="text-gray-500">SKU: {product._id.substring(product._id.length - 8)}</span>
                                </>
                            )}
                        </div>
                    </div>

                    {product.tallas?.length > 0 && (
                        <div className="space-y-3 font-robert-regular">
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
                                        onClick={() => setSelectedSize(talla)}
                                        className="h-12"
                                    >
                                        {talla}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    )}

                    {product.colores?.length > 0 && (
                        <div className="space-y-3 font-robert-regular">
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
                                            onClick={() => setSelectedColor(color)}
                                            className={`w-10 h-10 rounded-full border-2 transition-transform ${selectedColor === color
                                                ? 'border-orange-200 scale-110'
                                                : 'border-gray-600 hover:scale-90'
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

                    <div className="space-y-3 font-robert-regular">
                        <span className="text-sm font-medium">Cantidad</span>
                        <div className="flex items-center border rounded w-fit">
                            <button
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                className="px-3 py-2 hover:bg-gray-50"
                                disabled={quantity <= 1}
                            >
                                -
                            </button>
                            <span className="px-4 py-2 border-x min-w-[60px] text-center">{quantity}</span>
                            <button
                                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                className="px-3 py-2 hover:bg-gray-50"
                                disabled={quantity >= product.stock}
                            >
                                +
                            </button>
                        </div>
                    </div>

                    {/* Actions  */}
                    <div className="space-y-6 font-general">
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
                                onClick={() => setIsWishlist(!isWishlist)}
                                variant="outline"
                                className="h-12 border-gray-300 hover:bg-gray-50"
                                aria-label="Añadir a favoritos"
                            >
                                <Heart className={`h-5 w-5 ${isWishlist ? 'fill-red-500 text-red-500' : ''}`} />
                            </Button>
                        </div>
                    </div>

                    {/* Accordion */}
                    <div className="mt-6 font-robert-regular">
                        {[
                            {
                                value: "details",
                                title: "Detalles del producto",
                                content: (
                                    <div className="prose prose-sm max-w-none text-gray-700">
                                        <p>{product.descripcion}</p>
                                        <ul className="space-y-2 mt-2">
                                            <li><strong>Material:</strong> {product.material}</li>
                                            <li><strong>Estilo:</strong> {product.estilo}</li>
                                        </ul>
                                    </div>
                                )
                            },
                            {
                                value: "shipping",
                                title: "Envío y entrega",
                                content: (
                                    <p className="text-gray-700">
                                        Envío gratuito a partir de $99. Entrega estimada de 3-5 días hábiles.
                                    </p>
                                )
                            },
                            {
                                value: "returns",
                                title: "Devoluciones",
                                content: (
                                    <p className="text-gray-700">
                                        Tienes 30 días para devolver el producto sin cargo adicional.
                                    </p>
                                )
                            }
                        ].map(({ value, title, content }) => (
                            <div key={value} className="border rounded">
                                <button
                                    onClick={() => setExpandedAccordion(expandedAccordion === value ? '' : value)}
                                    className="w-full px-4 py-3 text-left font-medium hover:bg-gray-50 flex justify-between items-center"
                                >
                                    {title}
                                    <span>{expandedAccordion === value ? '−' : '+'}</span>
                                </button>
                                {expandedAccordion === value && (
                                    <div className="px-4 pb-3 border-t">
                                        {content}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <ProductRecommendations
                title="PRODUCTOS SIMILARES"
                subtitle={`Más productos en ${product.categoria}`}
                filter="popular"
                excludeProductId={product._id}
            />

            {isModalOpen && (
                <div className="fixed inset-0 bg-black z-[40] flex pt-24 font-general">
                    <button
                        onClick={() => setIsModalOpen(false)}
                        className="absolute top-4 right-4 z-[70] text-white hover:text-gray-300 p-2 bg-black/50 rounded-full"
                        aria-label="Cerrar modal"
                    >
                        <X className="h-8 w-8" />
                    </button>

                    <aside className="w-1/6 p-4 overflow-y-auto bg-black bg-opacity-80 z-[65] relative">
                        <div className="space-y-2">
                            {product.imagenes.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={(e) => { e.stopPropagation(); setMainImage(getImageUrl(img)); }}
                                    className={`w-full aspect-square relative rounded overflow-hidden transition-all ${
                                        mainImage === getImageUrl(img)
                                            ? 'ring-2 ring-white opacity-100'
                                            : 'opacity-60 hover:opacity-100'
                                    }`}
                                >
                                    <Image
                                        src={getImageUrl(img)}
                                        alt={`Vista ${idx + 1}`}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 16.67vw, 16.67vw"
                                    />
                                </button>
                            ))}
                        </div>
                    </aside>

                    <div 
                        className="absolute inset-0 flex items-center justify-center cursor-pointer z-[61]"
                        onClick={() => setIsModalOpen(false)}
                    >
                        <Image
                            src={mainImage}
                            alt={product.nombre}
                            fill
                            className="object-contain"
                            priority
                            onClick={(e) => e.stopPropagation()}
                            sizes="100vw"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}