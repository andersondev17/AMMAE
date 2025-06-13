'use client';
import { Button } from '@/components/ui/button';
import { PRODUCT_ACCORDION_CONFIG } from '@/constants/index';
import { useProductDetail } from '@/hooks/product/useProductDetail';
import { Product } from '@/types';
import { getColorValue } from '@/utils/colors';
import { Heart, ShoppingBag, X } from 'lucide-react';
import Image from 'next/image';
import ProductRecommendations from './ProductRecommendations';

export default function ProductDetail({ product }: { product: Product }) {
    const {
        selectedSize,
        selectedColor,
        quantity,
        mainImage,
        isWishlist,
        expandedAccordion,
        isModalOpen,
        pricing,
        optimizedImages,
        stockStatus,
        setSelectedSize,
        setSelectedColor,
        setMainImage,
        adjustQuantity,
        toggleWishlist,
        toggleModal,
        toggleAccordion,
        handleAddToCart
    } = useProductDetail(product);

    const renderAccordionContent = (config: typeof PRODUCT_ACCORDION_CONFIG[number]) => {
        switch (config.type) {
            case "text":
                return <p className="text-gray-700">{config.content}</p>;
            case "care_instructions":
                return (
                    <ul>
                        {config.instructions.map(instruction => (
                            <li key={instruction} className="list-disc ml-5">{instruction}</li>
                        ))}
                    </ul>
                );
            case "product_details":
                return (
                    <ul>
                        {config.fields.map(field => (
                            <li key={field} className="list-disc ml-5">
                                <strong>{field}:</strong> {product[field as keyof Product]}
                            </li>
                        ))}
                    </ul>
                );
            default:
                return null;
        }
    };

    return (
        <article className="max-w-full mx-auto pr-6 space-y-6 py-1">
            <div className="grid md:grid-cols-[2fr,1fr] gap-8">
                {/* IMAGE GALLERY */}
                <section className="space-y-4" aria-label="Galería de producto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Main Image */}
                        <button
                            className="aspect-[3/4] relative bg-gray-50 rounded-lg overflow-hidden cursor-pointer group focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onClick={toggleModal}
                            aria-label="Ampliar imagen principal"
                        >
                            <Image
                                src={mainImage}
                                alt={`${product.nombre} - Vista principal`}
                                fill
                                className="object-cover group-hover:opacity-90 transition-opacity"
                                priority
                                sizes="(max-width: 768px) 100vw, 50vw"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 flex items-center justify-center transition-all">
                                <div className="opacity-0 group-hover:opacity-100 bg-white rounded-full p-3 flex items-center gap-2 text-sm font-medium">
                                    <span className="text-2xl" aria-hidden="true">+</span>
                                    <span>Ampliar</span>
                                </div>
                            </div>
                        </button>

                        {/* Second Image - Desktop only */}
                        {optimizedImages.length > 1 && (
                            <button
                                className="aspect-[3/4] relative bg-gray-50 rounded-lg overflow-hidden hidden md:block cursor-pointer group focus:outline-none focus:ring-2 focus:ring-blue-500"
                                onClick={toggleModal}
                                aria-label="Ampliar segunda imagen"
                            >
                                <Image
                                    src={optimizedImages[1]}
                                    alt={`${product.nombre} - Vista 2`}
                                    fill
                                    className="object-cover group-hover:opacity-90 transition-opacity"
                                    sizes="50vw"
                                />
                            </button>
                        )}
                    </div>

                    {/* Thumbnails */}
                    <div className="grid grid-cols-5 gap-2" role="group" aria-label="Miniaturas del producto">
                        {optimizedImages.map((imageUrl, idx) => {
                            const isActive = mainImage === imageUrl;
                            return (
                                <button
                                    key={idx}
                                    onClick={() => setMainImage(imageUrl)}
                                    className={`relative aspect-square overflow-hidden transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${isActive ? 'ring-2 ring-primary' : 'opacity-75 hover:opacity-100'
                                        }`}
                                    aria-label={`Vista ${idx + 1} de ${product.nombre}`}
                                    aria-pressed={isActive}
                                >
                                    <Image
                                        src={imageUrl}
                                        alt={`Vista ${idx + 1}`}
                                        fill
                                        className="object-cover"
                                        sizes="20vw"
                                        priority={idx === 0} // ✅ Solo primera imagen prioritaria
                                    />
                                </button>
                            );
                        })}
                    </div>
                </section>

                {/* PRODUCT INFO */}
                <section className="space-y-8 pt-0 md:py-20 py-28 px-8">
                    {/* Product Header */}
                    <header>
                        <h1 className="text-xl font-medium font-robert-medium">{product.nombre}</h1>
                        <p className="text-gray-500 mt-1 font-robert-regular">{product.categoria}</p>

                        {/* Pricing */}
                        <div className="flex items-baseline gap-4 mt-4 font-robert-medium">
                            {pricing.isOnSale ? (
                                <>
                                    <span className="text-lg font-medium text-red-700">
                                        {pricing.formatted.final} COP
                                    </span>
                                    <span className="px-2 bg-red-700 text-white text-xs">
                                        -{pricing.discount}% OFF
                                    </span>
                                    <span className="text-gray-500 line-through text-sm">
                                        {pricing.formatted.original} COP
                                    </span>
                                </>
                            ) : (
                                <span className="text-lg font-medium">
                                    {pricing.formatted.final} COP
                                </span>
                            )}
                        </div>

                        {/* Stock Status */}
                        <div className="flex items-center gap-2 text-sm mt-2 font-robert-regular">
                            <span className={`font-medium ${stockStatus.color}`}>{stockStatus.text}</span>
                            {product.stock > 0 && (
                                <>
                                    <span className="text-gray-300" aria-hidden="true">•</span>
                                    <span className="text-gray-500">SKU: {product._id.slice(-8)}</span>
                                </>
                            )}
                        </div>
                    </header>

                    {/* Size Selection */}
                    {product.tallas?.length > 0 && (
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Talla</span>
                                <button
                                    className="text-sm text-blue-600 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    onClick={() => window.open('/size-guide', '_blank')}
                                >
                                    Guía de tallas
                                </button>
                            </div>
                            <div className="grid grid-cols-4 ">
                                {product.tallas.map((talla) => (
                                    <Button
                                        key={talla}
                                        variant={selectedSize === talla ? 'default' : 'outline'}
                                        onClick={() => setSelectedSize(talla)}
                                        className=" border-rounded rounded-full font-robert-regular"
                                        aria-pressed={selectedSize === talla}
                                    >
                                        {talla}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Color Selection */}
                    {product.colores?.length > 0 && (
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium font-robert-regular">Color</span>
                                <span className="text-sm text-gray-500 font-robert-regular">
                                    {selectedColor || 'Selecciona un color'}
                                </span>
                            </div>
                            <div className="flex flex-wrap gap-2 font-general">
                                {product.colores.map((color) => (
                                    <button
                                        key={color}
                                        onClick={() => setSelectedColor(color)}
                                        className={`w-10 h-10 rounded-full border-2 transition-transform focus:outline-none focus:ring-2 focus:ring-blue-500 ${selectedColor === color
                                            ? 'border-orange-200 scale-110'
                                            : 'border-gray-600 hover:scale-90'
                                            }`}
                                        style={{ backgroundColor: getColorValue(color) }}
                                        title={color}
                                        aria-pressed={selectedColor === color}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Quantity Selection */}
                    <div className="space-y-3">
                        <label htmlFor="quantity" className="text-sm font-medium font-robert-regular">Cantidad</label>
                        <div className="flex items-center border rounded w-fit">
                            <button
                                onClick={() => adjustQuantity(-1)}
                                className="px-3 py-2 hover:bg-gray-50 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                disabled={quantity <= 1}
                                aria-label="Disminuir cantidad"
                            >
                                -
                            </button>
                            <span
                                id="quantity"
                                className="px-4 py-2 border-x min-w-[60px] text-center font-robert-regular"
                                aria-live="polite"
                            >
                                {quantity}
                            </span>
                            <button
                                onClick={() => adjustQuantity(1)}
                                className="px-3 py-2 hover:bg-gray-50 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                disabled={quantity >= product.stock}
                                aria-label="Aumentar cantidad"
                            >
                                +
                            </button>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4">
                        <Button
                            onClick={handleAddToCart}
                            disabled={product.stock === 0}
                            className="flex-1 h-12 bg-black hover:bg-gray-900 text-white disabled:opacity-50 font-robert-regular"
                        >
                            <ShoppingBag className="mr-2 h-5 w-5" aria-hidden="true" />
                            {product.stock === 0 ? 'Agotado' : 'Agregar al carrito'}
                        </Button>

                        <Button
                            onClick={toggleWishlist}
                            variant="outline"
                            className="h-12 border-gray-300 hover:bg-gray-50"
                            aria-label={isWishlist ? 'Quitar de favoritos' : 'Añadir a favoritos'}
                        >
                            <Heart
                                className={`h-5 w-5 ${isWishlist ? 'fill-red-500 text-red-500' : ''}`}
                                aria-hidden="true"
                            />
                        </Button>
                    </div>

                    {/* ✅ Accordion SIMPLIFICADO */}
                    <div className="space-y-2 font-robert-regular" role="region" aria-label="Información adicional del producto">
                        {PRODUCT_ACCORDION_CONFIG.map((config) => {
                            const { value, title } = config;
                            const isExpanded = expandedAccordion === value;

                            return (
                                <div key={value} className="border rounded">
                                    <button
                                        onClick={() => toggleAccordion(value)}
                                        className="w-full px-4 py-3 text-left font-medium hover:bg-gray-50 flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        aria-expanded={isExpanded}
                                        aria-controls={`accordion-content-${value}`}
                                    >
                                        {title}
                                        <span aria-hidden="true">{isExpanded ? '−' : '+'}</span>
                                    </button>
                                    {isExpanded && (
                                        <div
                                            id={`accordion-content-${value}`}
                                            className="px-4 pb-3 border-t text-gray-700"
                                            role="region"
                                        >
                                            {renderAccordionContent(config)}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </section>
            </div>

            {/* Product Recommendations */}
            <ProductRecommendations
                title="PRODUCTOS SIMILARES"
                subtitle={`Más productos en ${product.categoria}`}
                filter="popular"
                excludeProductId={product._id}
            />

            {/* ✅ Modal MEJORADO con accesibilidad completa */}
            {isModalOpen && (
                <div
                    className="fixed inset-0 bg-black z-[40] flex pt-24"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="modal-title"
                >
                    <h2 id="modal-title" className="sr-only">
                        Galería ampliada: {product.nombre}
                    </h2>

                    <button
                        onClick={toggleModal}
                        className="absolute top-4 right-4 z-[70] text-white hover:text-gray-300 p-2 bg-black/50 rounded-full focus:outline-none focus:ring-2 focus:ring-white"
                        aria-label="Cerrar galería"
                    >
                        <X className="h-8 w-8" />
                    </button>

                    <aside className="w-1/6 p-4 overflow-y-auto bg-black/80 z-[65]">
                        <div className="space-y-2">
                            {optimizedImages.map((imageUrl, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setMainImage(imageUrl)}
                                    className={`w-full aspect-square relative rounded overflow-hidden transition-all focus:outline-none focus:ring-2 focus:ring-white ${mainImage === imageUrl
                                        ? 'ring-2 ring-white opacity-100'
                                        : 'opacity-60 hover:opacity-100'
                                        }`}
                                    aria-label={`Seleccionar vista ${idx + 1}`}
                                >
                                    <Image
                                        src={imageUrl}
                                        alt={`Vista ${idx + 1}`}
                                        fill
                                        className="object-cover"
                                        sizes="16.67vw"
                                    />
                                </button>
                            ))}
                        </div>
                    </aside>

                    <div
                        className="absolute inset-0 flex items-center justify-center cursor-pointer z-[61]"
                        onClick={toggleModal}
                    >
                        <Image
                            src={mainImage}
                            alt={`${product.nombre} - Vista ampliada`}
                            fill
                            className="object-contain"
                            priority
                            onClick={(e) => e.stopPropagation()}
                            sizes="100vw"
                        />
                    </div>
                </div>
            )}
        </article>
    );
}