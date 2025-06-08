'use client';
import { useCart } from '@/hooks/cart/useCart';
import { getImageUrl } from '@/utils/imageUtils';
import { ShoppingBag, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

export const CartNotification = () => {
    const { showNotification, lastAdded, itemCount, hideNotification, openCart } = useCart();
    const router = useRouter();

    if (!showNotification || !lastAdded) return null;

    const price = lastAdded.enOferta && lastAdded.precioOferta ? lastAdded.precioOferta : lastAdded.precio;

    return (
        <div className="fixed top-20 right-7 z-50 w-80 bg-white border rounded-lg shadow-xl p-6 animate-in slide-in-from-right">
            <button onClick={hideNotification} className="absolute top-2 right-2 p-1 hover:bg-gray-100 rounded">
                <X className="w-4 h-4" />
            </button>
            
            <div className="flex gap-4 mb-4">
                <img 
                    src={getImageUrl(lastAdded.imagenes?.[0])} 
                    alt=""
                    className="w-16 h-20 object-cover rounded"
                />
                <div className="flex-1 min-w-0">
                    <p className="font-bold text-blue-600">{price.toLocaleString()} COP</p>
                    <p className="text-sm text-gray-700 truncate">{lastAdded.nombre}</p>
                    <div className="flex gap-1 mt-1 text-xs">
                        {lastAdded.selectedSize && <span className="bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">{lastAdded.selectedSize}</span>}
                        {lastAdded.selectedColor && <span className="bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded">{lastAdded.selectedColor}</span>}
                    </div>
                </div>
            </div>
            
            <div className="space-y-2">
                <button 
                    onClick={() => { hideNotification(); router.push('/checkout'); }}
                    className="w-full bg-blue-800 text-white text-xs font-bold py-2 px-3 rounded hover:bg-blue-900"
                >
                    CHECKOUT
                </button>
                <button 
                    onClick={() => { hideNotification(); openCart(); }}
                    className="w-full border border-blue-700 text-blue-700 text-xs font-bold py-2 px-3 rounded hover:bg-blue-50"
                >
                    <ShoppingBag className="inline w-3 h-3 mr-1" /> VER CESTA ({itemCount})
                </button>
            </div>
        </div>
    );
};