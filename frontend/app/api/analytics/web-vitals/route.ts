// frontend/app/api/analytics/web-vitals/route.ts
import { NextRequest, NextResponse } from 'next/server';

interface WebVitalMetric {
    name: string;
    value: number;
    id: string;
    rating?: string;
    timestamp?: number;
    page?: string;
    deviceType?: string;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
        // Parse datos de la métrica
        const metricData: WebVitalMetric = await req.json();
        console.log('Web Vital métrica recibida:', metricData);

        return NextResponse.json({ received: true });
    } catch (error) {
        console.error('Error procesando métricas:', error);
        return NextResponse.json(
            { error: 'Error al procesar métricas' },
            { status: 500 }
        );
    }
}

export async function GET(): Promise<NextResponse> {
    return NextResponse.json(
        { error: 'Method not allowed' },
        { status: 405, headers: { Allow: 'POST' } }
    );
}