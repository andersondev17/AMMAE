import { cn } from '@/lib/utils';
import { ChevronDown, Pause, Play, Volume2, VolumeX } from 'lucide-react';
import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';

interface VideoHeroProps {
    videoUrl?: string;
    placeholderImage?: string;
    title: string;
    subtitle?: string;
    ctaText?: string;
    onCtaClick?: () => void;
}

export const VideoHero = ({
    videoUrl,
    placeholderImage = '/assets/images/hero-preview.jpg',
    title,
    subtitle,
    ctaText = "Explorar Colección",
    onCtaClick
}: VideoHeroProps) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(true);
    const [isLoaded, setIsLoaded] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const playAttempted = useRef(false);

    const handlePlayback = useCallback(async (play = true) => {
        if (!videoRef.current) return;

        try {
            play ? await videoRef.current.play() : videoRef.current.pause();
            setIsPlaying(play);
        } catch (error) {
            if (play) {
                const retryPlay = async () => {
                    await videoRef.current?.play();
                    document.removeEventListener('click', retryPlay);
                    document.removeEventListener('touchstart', retryPlay);
                };
                document.addEventListener('click', retryPlay);
                document.addEventListener('touchstart', retryPlay);
            }
        }
    }, []);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const handleLoad = () => {
            setIsLoaded(true);
            handlePlayback(true);
        };

        video.addEventListener('loadeddata', handleLoad);
        video.readyState >= 3 && handleLoad();

        return () => {
            video.removeEventListener('loadeddata', handleLoad);
            video.pause();
            playAttempted.current = false;
        };
    }, [handlePlayback]);

    useEffect(() => {
        const handleVisibility = () => {
            document.visibilityState === 'visible' &&
                !isPlaying &&
                videoRef.current?.play().then(() => setIsPlaying(true));
        };

        document.addEventListener('visibilitychange', handleVisibility);
        return () => document.removeEventListener('visibilitychange', handleVisibility);
    }, [isPlaying]);

    const controlButton = "p-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 hover:shadow-lg";

    return (
        <div className="relative w-full h-screen overflow-hidden">
            {/* Preload Image with Transition */}
            <div className={cn(
                "absolute inset-0 z-20 transition-opacity duration-500",
                isLoaded ? "opacity-0 pointer-events-none" : "opacity-100"
            )}>
                <Image
                    src={placeholderImage}
                    alt="Preview"
                    fill
                    className="object-cover"
                    priority
                    sizes="100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/40" />
            </div>

            {/* Video Element */}
            <video
                ref={videoRef}
                className="absolute inset-0 w-full h-full object-cover"
                autoPlay
                loop
                muted={isMuted}
                playsInline
                preload="auto"
            >
                {videoUrl && <source src={videoUrl} type="video/mp4" />}
            </video>

            {/* Content Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/40 z-10" />

            {/* Main Content */}
            <div className="relative z-20 h-full flex flex-col justify-center items-center text-white px-4 sm:px-6 lg:px-8">
                <h1 className="special-font hero-heading max-w-3xl text-center mb-6">
                    {title}
                </h1>

                {subtitle && (
                    <p className="mb-6 max-w-xl text-center font-robert-regular text-blue-100">
                        {subtitle}
                    </p>
                )}

                <button
                    onClick={onCtaClick}
                    className="px-8 py-4 bg-white text-black font-medium rounded-full hover:bg-black hover:text-white 
                               transition-all duration-300 transform hover:scale-105 shadow-lg relative overflow-hidden group"
                >
                    <span className="absolute inset-0 w-full h-full bg-black scale-x-0 origin-left transition-transform 
                                  duration-300 group-hover:scale-x-100" />
                    <span className="relative z-10 transition-colors duration-300 group-hover:text-white font-zentry tracking-wide">
                        {ctaText}
                    </span>
                </button>

                <ChevronDown
                    onClick={onCtaClick}
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 w-8 h-8 text-white animate-bounce cursor-pointer 
                             transition-opacity duration-300 hover:opacity-80"
                />
            </div>

            {/* Media Controls */}
            <div className="absolute bottom-8 right-8 z-30 flex gap-4">
                <button
                    onClick={() => handlePlayback(!isPlaying)}
                    className={controlButton}
                    aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
                >
                    {isPlaying ? (
                        <Pause className="w-6 h-6 text-white hover:scale-110 transition-transform" />
                    ) : (
                        <Play className="w-6 h-6 text-white hover:scale-110 transition-transform" />
                    )}
                </button>
                <button
                    onClick={() => setIsMuted(!isMuted)}
                    className={controlButton}
                    aria-label={isMuted ? 'Activar sonido' : 'Silenciar'}
                >
                    {isMuted ? (
                        <VolumeX className="w-6 h-6 text-white hover:scale-110 transition-transform" />
                    ) : (
                        <Volume2 className="w-6 h-6 text-white hover:scale-110 transition-transform" />
                    )}
                </button>
            </div>
        </div>
    );
};