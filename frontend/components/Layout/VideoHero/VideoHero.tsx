'use client';

import { cn } from '@/lib/utils';
import { VideoHeroProps } from '@/types/index';
import Image from 'next/image';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
export const VideoHero = memo(({ videoUrl, placeholderImage, title, subtitle, ctaText = "Explorar Colección", onCtaClick }: VideoHeroProps) => {
    const [isVisible, setIsVisible] = useState(false);
    const [videoLoaded, setVideoLoaded] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // IntersectionObserver para lazy-loading
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => observer.disconnect();
    }, []);

    // Video loading optimizado
    useEffect(() => {
        if (!isVisible || !videoUrl || !videoRef.current) return;

        // Precargar solo cuando sea visible
        const handleLoad = () => setVideoLoaded(true);
        const video = videoRef.current;

        video.addEventListener('loadeddata', handleLoad);

        if (video.readyState >= 3) {
            setVideoLoaded(true);
        }

        return () => video.removeEventListener('loadeddata', handleLoad);
    }, [isVisible, videoUrl]);

    // Handler para el CTA
    const handleCtaClick = useCallback(() => {
        onCtaClick?.();
    }, [onCtaClick]);

    return (
        <div ref={containerRef} className="relative w-full h-[90vh] overflow-hidden">
            <div className={cn(
                "absolute inset-0 z-10 transition-opacity duration-700",
                videoLoaded && videoUrl ? "opacity-0" : "opacity-100"
            )}>
                <Image
                    src={placeholderImage}
                    alt={title}
                    fill
                    priority
                    sizes="100vw"
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-black/40" />
            </div>

            {/* Video - renderizado condicionalmente */}
            {isVisible && videoUrl && (
                <video
                    ref={videoRef}
                    className="absolute inset-0 w-full h-full object-cover"
                    autoPlay
                    muted
                    loop
                    playsInline
                >
                    <source src={videoUrl} type="video/mp4" />
                </video>
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-20" />

            <div className="relative z-30 h-full flex flex-col justify-center items-center text-white px-4">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-4 max-w-3xl">
                    {title}
                </h1>

                {subtitle && (
                    <p className="text-lg md:text-xl text-center mb-8 max-w-2xl">
                        {subtitle}
                    </p>
                )}

                <button
                    onClick={handleCtaClick}
                    className="px-8 py-3 bg-white text-black font-medium rounded-full 
                     hover:bg-black hover:text-white transition-colors duration-300"
                >
                    {ctaText}
                </button>
            </div>
        </div>
    );
});

VideoHero.displayName = 'VideoHero';