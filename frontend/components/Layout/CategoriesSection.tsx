import { Category } from '@/types/index';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

const categories: Category[] = [
    {
        id: 'Jeans',
        name: 'JEANS',
        image: '/assets/images/demo/jeans/jean-1.jpg',
        description: 'Colección exclusiva de jeans',
        link: '/categoria/jeans'
    },
    {
        id: 'Blusas',
        name: 'BLUSAS',
        image: '/assets/images/demo/blusas/blusa-floral-1.jpg',
        description: 'Blusas para toda ocasión',
        link: '/categoria/blusas'
    },
    {
        id: 'Vestidos',
        name: 'VESTIDOS',
        image: '/assets/images/demo/vestidos/vestido-1.png',
        description: 'Vestidos elegantes',
        link: '/categoria/vestidos'
    },
    {
        id: 'Accesorios',
        name: 'ACCESORIOS',
        image: '/assets/images/demo/accesorios/accesorio-1.png',
        description: 'Complementa tu estilo',
        link: '/categoria/accesorios'
    }
];


const CategoryCard = ({ category, index }: { category: Category; index: number }) => {
    const [isInView, setIsInView] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true);
                    observer.unobserve(entry.target);
                }
            },
            {
                threshold: 0.15,
                rootMargin: "50px",
            }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                observer.disconnect();
            }
        };
    }, []);

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: index * 0.2 }}
            className="group relative h-[90vh] w-full overflow-hidden"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <Link href={category.link} className="block h-full">
                <div className="relative h-full w-full">
                    <Image
                        src={category.image}
                        alt={category.name}
                        fill
                        className="object-cover object-center transition-transform duration-700 ease-out will-change-transform group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        priority={index === 0}
                    />
                    <div
                        className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-60 
                                 transition-opacity duration-500 group-hover:opacity-80"
                    />

                    <motion.div
                        className="absolute inset-0 flex flex-col justify-end p-8 md:p-12"
                        animate={{ opacity: isHovered ? 1 : 0.9 }}
                        transition={{ duration: 0.3 }}
                    >
                        <motion.h3
                            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 
                                     tracking-tight leading-tight"
                            animate={{
                                y: isHovered ? 0 : 10,
                                scale: isHovered ? 1.05 : 1
                            }}
                            transition={{ duration: 0.4 }}
                        >
                            {category.name}
                        </motion.h3>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{
                                opacity: isHovered ? 1 : 0,
                                y: isHovered ? 0 : 20
                            }}
                            transition={{ duration: 0.3 }}
                            className="space-y-6"
                        >
                            <p className="text-xl text-gray-200 max-w-xl">
                                {category.description}
                            </p>
                            <button className="inline-flex items-center px-8 py-4 rounded-full 
                                           bg-white/10 backdrop-blur-md text-white border border-white/20 
                                           transition-all duration-300 transform hover:bg-white 
                                           hover:text-black hover:scale-105">
                                Explorar Colección
                                <motion.svg
                                    className="ml-2 w-6 h-6"
                                    viewBox="0 0 24 24"
                                    animate={{ x: isHovered ? 5 : 0 }}
                                >
                                    <path
                                        fill="currentColor"
                                        d="M13.025 1l-2.847 2.828 6.176 6.176h-16.354v3.992h16.354l-6.176 6.176 2.847 2.828 10.975-11z"
                                    />
                                </motion.svg>
                            </button>
                        </motion.div>
                    </motion.div>
                </div>
            </Link>
        </motion.div>
    );
};

const CategoriesSection = () => {
    return (
        <section className="relative bg-black min-h-screen">
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.02] pointer-events-none" />

            <div
                className="text-center py-16 md:py-24 text-white relative z-10"
            >
                <h2 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 
                             bg-clip-text text-transparent px-4">
                    Nuestras Colecciones
                </h2>
                <p className="text-xl text-gray-300 max-w-3xl mx-auto px-4">
                    Descubre las últimas tendencias en moda femenina
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2">
                {categories.map((category, index) => (
                    <CategoryCard
                        key={category.id}
                        category={category}
                        index={index}
                    />
                ))}
            </div>
        </section>
    );
};

export default CategoriesSection;