'use client';
import { VideoHeroProps } from '@/types/index';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { memo, useEffect, useRef, useState } from 'react';

export const VideoHero = memo(({ videoUrl, placeholderImage, title, subtitle, ctaText = "Explorar Colección", onCtaClick }: VideoHeroProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isMobile, setIsMobile] = useState(false);

    // Detectar móvil
    useEffect(() => {
        setIsMobile(window.innerWidth < 768);

        // Precargar la imagen del poster para LCP
        const preloadLink = document.createElement('link');
        preloadLink.rel = 'preload';
        preloadLink.as = 'image';
        preloadLink.href = placeholderImage;
        preloadLink.fetchPriority = 'high';
        document.head.appendChild(preloadLink);

        // Return a destructor function to remove the link element
        return () => {
            document.head.removeChild(preloadLink);
        };
    }, [placeholderImage]);
    useGSAP(() => {
        if (!containerRef.current) return;

        gsap.to(containerRef.current.querySelector('.hero-content'), {
            y: 300,
            opacity: 0,
            scrollTrigger: {
                trigger: containerRef.current,
                start: 'top top',
                end: '60% top',
                scrub: 0.8,
            }
        });
    }, { scope: containerRef, dependencies: [] });

    return (
        <div ref={containerRef} className="relative w-full h-[90vh] overflow-hidden">
            {isMobile ? (
                <div
                    className="w-full h-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${placeholderImage})` }}
                    aria-hidden="true"
                />
            ) : (
                <video
                    className="w-full h-full object-cover"
                    poster={placeholderImage}
                    autoPlay
                    muted
                    loop
                    playsInline
                >
                    <source src={videoUrl} type="video/webm" />
                    <source src={videoUrl} type="video/mp4" />
                </video>
            )}

            <div className="absolute inset-0 bg-black/30" aria-hidden="true" />

            <div className="hero-content absolute inset-0 z-10 flex flex-col justify-center items-center text-white px-4">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-4 max-w-3xl">
                    {title}
                </h1>
                {subtitle && (
                    <p className="text-lg md:text-xl text-center mb-8 max-w-2xl">
                        {subtitle}
                    </p>
                )}
                <button
                    onClick={onCtaClick}
                    className="px-8 py-3 bg-white text-black font-medium rounded-full hover:bg-black hover:text-white transition-colors duration-300"
                    aria-label={ctaText}
                >
                    {ctaText}
                </button>
            </div>
        </div>
    );
});

VideoHero.displayName = 'VideoHero';