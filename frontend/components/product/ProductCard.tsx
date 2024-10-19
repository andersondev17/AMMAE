import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '../../types';

interface ProductCardProps {
    product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    return (
        <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-lg shadow-lg overflow-hidden"
        >
            <Link href={`/product/${product._id}`} passHref>
                <div className="relative h-64 w-full">
                    <Image
                        src={product.imagenes[0].startsWith('http') ? product.imagenes[0] : `/${product.imagenes[0]}`}
                        alt={product.nombre}
                        width={300}
                        height={300}
                        className="object-cover transition-opacity duration-300 hover:opacity-75"
                    />
                </div>
                <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{product.nombre}</h3>
                    <div className="flex justify-between items-center">
                        <span className="text-xl font-bold text-indigo-600">${product.precio}</span>
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            className="bg-indigo-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-indigo-700 transition-colors duration-300"
                        >
                            Add to Cart
                        </motion.button>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
};