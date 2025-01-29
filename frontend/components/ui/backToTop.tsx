"use client";

import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

export const BackToTop = () => {
    const [isVisible, setIsVisible] = useState(false);

    // Mostrar botón después de scrollear 500px
    const toggleVisibility = () => {
        if (window.scrollY > 500) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    // Scroll suave hacia arriba
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    useEffect(() => {
        window.addEventListener("scroll", toggleVisibility);
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    return (
        <button
            onClick={scrollToTop}
            className={`
        fixed bottom-8 right-8 p-2
        bg-white/80 hover:bg-white
        backdrop-blur-sm
        rounded-full shadow-lg
        transition-all duration-300 ease-in-out
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}
      `}
            aria-label="Volver arriba"
        >
            <ArrowUp className="h-5 w-5 text-gray-600" />
        </button>
    );
};