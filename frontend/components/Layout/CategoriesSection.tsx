import { categories } from '@/constants';
import { Category } from '@/types/index';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { Skeleton } from '../ui';

const CategoryCard = ({ category, index }: { category: Category; index: number }) => {
    const [isLoading, setIsLoading] = useState(true);
    const imageRef = useRef<HTMLImageElement>(null);
    
    useEffect(() => {
        if (imageRef.current?.complete) {
            setIsLoading(false);
        }
    }, []);

    return (
        <div className="group relative w-full aspect-square p-1 flex-shrink-0">
            <Link href={category.link} className="block h-full w-full" prefetch={false}>
                <div className="relative h-full w-full overflow-hidden">
                    {isLoading && (
                        <Skeleton className="absolute inset-0 z-10 bg-gray-200" />
                    )}
                    <Image
                        ref={imageRef}
                        src={category.image}
                        alt={category.name}
                        fill
                        className={`object-cover object-center transition-opacity duration-300 ${
                            isLoading ? 'opacity-0' : 'opacity-100'
                        }`}
                        sizes="(max-width: 768px) 100vw, 33vw"
                        priority={index < 3}
                        quality={80}
                        onLoad={() => setIsLoading(false)}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <h3 className="absolute bottom-4 left-4 text-xl font-bold text-white z-20">
                        {category.name}
                    </h3>
                </div>
            </Link>
        </div>
    );
};

const CategoriesSection = () => {
    return (
        <section className="bg-black">
            <div className="flex md:flex-row lg:flex-nowrapsnap-x xl:flex-nowrap snap-mandatory overflow-x-hidden">
                {categories.map((category, index) => (
                    <div key={category.id} className="snap-center w-full md:w-1/4">
                        <CategoryCard category={category} index={index} />
                    </div>
                ))}
            </div>
            <div className="container mx-auto py-6 px-4 text-white">
                <h2 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    NUESTRAS COLECCIONES
                </h2>
                <p className="mt-2 text-gray-300 uppercase text-sm">
                    DESCUBRE LAS ÚLTIMAS TENDENCIAS EN MODA FEMENINA <b>@AMMAE.CO</b>
                </p>
            </div>


        </section>
    );
};

export default CategoriesSection;