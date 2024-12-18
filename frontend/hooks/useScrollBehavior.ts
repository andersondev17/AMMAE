
import { useEffect, useState } from 'react';

interface ScrollBehavior {
    isVisible: boolean;
    isAtTop: boolean;
    hasScrolled: boolean;
}

export const useScrollBehavior = (threshold = 100, scrollDistance = 50) => {
    const [scrollBehavior, setScrollBehavior] = useState<ScrollBehavior>({
        isVisible: true,
        isAtTop: true,
        hasScrolled: false
    });
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            setScrollBehavior(prev => ({
                isVisible: currentScrollY < lastScrollY || currentScrollY < threshold,
                isAtTop: currentScrollY < threshold,
                hasScrolled: currentScrollY > threshold
            }));

            setLastScrollY(currentScrollY);
        };

        const debouncedHandleScroll = debounce(handleScroll, 10);
        window.addEventListener('scroll', debouncedHandleScroll);

        return () => window.removeEventListener('scroll', debouncedHandleScroll);
    }, [lastScrollY, threshold]);

    return scrollBehavior;
};

const debounce = (fn: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn(...args), delay);
    };
};