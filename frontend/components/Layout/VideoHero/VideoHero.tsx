// components/Layout/VideoHero/index.tsx
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, Pause, Play, Volume2, VolumeX } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface VideoHeroProps {
    videoUrl: string;
    title: string;
    subtitle?: string;
    ctaText?: string;
    onCtaClick?: () => void;
}

export const VideoHero = ({
    videoUrl,
    title,
    subtitle,
    ctaText = "Explorar Colección",
    onCtaClick
}: VideoHeroProps) => {
    const [isPlaying, setIsPlaying] = useState(true);
    const [isMuted, setIsMuted] = useState(true);
    const [isLoaded, setIsLoaded] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.play().catch(() => {
                setIsPlaying(false);
            });
        }
    }, []);

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const toggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    return (
        <div className="relative w-full h-screen overflow-hidden">
            {/* Video Background */}
            <video
                ref={videoRef}
                className="absolute top-0 left-0 w-full h-full object-cover"
                autoPlay
                loop
                muted={isMuted}
                playsInline
                onLoadedData={() => setIsLoaded(true)}
            >
                <source src={videoUrl} type="video/mp4" />
            </video>

            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/40 z-10" />

            {/* Content */}
            <AnimatePresence>
                {isLoaded && (
                    <motion.div
                        className="relative z-20 h-full flex flex-col justify-center items-center text-white px-4 sm:px-6 lg:px-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        <motion.h1
                            className="text-4xl md:text-6xl lg:text-7xl font-bold text-center mb-6"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                        >
                            {title}
                        </motion.h1>
                        {subtitle && (
                            <motion.p
                                className="text-xl md:text-2xl text-center mb-8 max-w-2xl"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.6 }}
                            >
                                {subtitle}
                            </motion.p>
                        )}
                        <motion.button
                            className="px-8 py-4 bg-white text-black font-medium rounded-full 
                                     hover:bg-black hover:text-white transition-all duration-300
                                     transform hover:scale-105 shadow-lg"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={onCtaClick}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.8 }}
                        >
                            {ctaText}
                        </motion.button>

                        <motion.div
                            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 1 }}
                        >
                            <ChevronDown
                                className="w-8 h-8 text-white animate-bounce cursor-pointer"
                                onClick={onCtaClick}
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Video Controls */}
            <div className="absolute bottom-8 right-8 z-30 flex gap-4">
                <button
                    onClick={togglePlay}
                    className="p-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 
                             transition-all duration-300 group"
                    aria-label={isPlaying ? 'Pausar video' : 'Reproducir video'}
                >
                    {isPlaying ?
                        <Pause className="w-6 h-6 text-white group-hover:scale-110 transition-transform" /> :
                        <Play className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
                    }
                </button>
                <button
                    onClick={toggleMute}
                    className="p-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 
                             transition-all duration-300 group"
                    aria-label={isMuted ? 'Activar sonido' : 'Silenciar video'}
                >
                    {isMuted ?
                        <VolumeX className="w-6 h-6 text-white group-hover:scale-110 transition-transform" /> :
                        <Volume2 className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
                    }
                </button>
            </div>
        </div>
    );
};