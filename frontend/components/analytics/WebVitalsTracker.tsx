'use client';

import { useEffect } from 'react';

export function WebVitalsTracker() {
    useEffect(() => {
        if (typeof window !== 'undefined') {
            import('@/lib/analytics/webVitals').catch(err =>
                console.error('Error cargando web-vitals:', err)
            );
        }
    }, []);

    return null;
}