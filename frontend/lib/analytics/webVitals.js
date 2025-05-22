// frontend/lib/analytics/webVitals.js - VERSIÓN MINIMALISTA
import { onCLS, onINP, onLCP } from 'web-vitals';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

function sendToAnalytics(metric) {
    // Asegurar que enviamos exactamente lo que el backend espera
    const payload = {
        name: metric.name.toUpperCase(), // Lo importante es convertir a mayúsculas
        value: metric.value,
        rating: metric.rating || 'neutral',
        id: metric.id || '',
        page: window.location.pathname,
        deviceType: window.innerWidth < 768 ? 'mobile' : 'desktop',
        timestamp: Date.now()
    };
    
    const endpoint = `${API_URL}/analytics/web-vitals`;
    console.log('Enviando métrica:', payload);
    
    try {
        // Usar solo fetch para simplificar y evitar problemas con sendBeacon
        fetch(endpoint, {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: { 'Content-Type': 'application/json' },
            keepalive: true
        });
    } catch (error) {
        console.error('Error enviando métrica:', error);
    }
}

// Registramos las Core Web Vitals
onCLS(sendToAnalytics);
onINP(sendToAnalytics);
onLCP(sendToAnalytics);