'use client';

import { cn } from '@/lib/utils';
import { SeriesCollectionDirective, SeriesDirective } from '@syncfusion/ej2-react-charts';
import dynamic from 'next/dynamic';
import { memo, useMemo } from 'react';

const ChartComponent = dynamic(
    () => import('@syncfusion/ej2-react-charts').then((mod) => {
        const { ChartComponent, LineSeries, Category, Tooltip } = mod;
        ChartComponent.Inject(LineSeries, Category, Tooltip);
        return ChartComponent;
    }),
    {
        ssr: false,
        loading: () => <div className="h-[300px] flex items-center justify-center">Cargando gráfico...</div>
    }
);

interface RevenueChartProps {
    data: Array<{ x: string; y: number }>;
    title?: string;
    height?: string;
    className?: string;
}

// ✅ BUSINESS-FOCUSED CHART
export const RevenueChart = memo(({ data, height = "300px", className }: RevenueChartProps) => {
    const chartConfig = useMemo(() => ({
        primaryXAxis: {
            valueType: 'Category' as const,
            title: 'Período',
            labelIntersectAction: 'Rotate45' as const,
            majorGridLines: { width: 0 },
            labelStyle: { fontSize: '11px', color: '#6B7280' }
        },
        primaryYAxis: {
            title: 'Ingresos (COP)',
            labelFormat: '${value}',
            majorGridLines: { width: 1, color: '#F3F4F6' },
            labelStyle: { fontSize: '11px', color: '#6B7280' }
        },
        tooltip: {
            enable: true,
            format: '<b>${point.x}</b><br/>Ingresos: <b>$${point.y}</b>'
        },
        zoomSettings: {
            enableSelectionZooming: true,
            enablePinchZooming: true,
            enableMouseWheelZooming: true
        },
        background: 'transparent'
    }), []);

    if (!data?.length) {
        return (
            <div className={cn("h-[300px] flex items-center justify-center text-gray-500", className)}>
                <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 opacity-50">📊</div>
                    <p className="text-sm">No hay datos disponibles</p>
                </div>
            </div>
        );
    }

    return (
        <div className={cn("w-full", className)}>
            <ChartComponent
                id="revenue-chart"
                height={height}
                width="100%"
                {...chartConfig}
                theme="Bootstrap5"
            >
                <SeriesCollectionDirective>
                    <SeriesDirective
                        dataSource={data}
                        xName="x"
                        yName="y"
                        type="Line"
                        name="Ingresos"
                        marker={{
                            visible: true,
                            height: 6,
                            width: 6,
                            shape: 'Circle',
                            fill: '#000000'
                        }}
                        fill="#000000"
                        width={2.5}
                    />
                </SeriesCollectionDirective>
            </ChartComponent>
        </div>
    );
});

export const BusinessChart = memo(({ data }: { data: Array<{ x: string; y: number }> }) => {
    if (!data?.length) return null;

    const maxValue = Math.max(...data.map(d => d.y));
    const minValue = Math.min(...data.map(d => d.y));
    const range = maxValue - minValue || 1;

    // BUSINESS CALCULATIONS
    const total = data.reduce((sum, d) => sum + d.y, 0);
    const average = Math.round(total / data.length);
    const trend = data[data.length - 1].y > data[0].y ? 'up' : 'down';

    const points = data.map((d, i) => {
        const x = 60 + (i / (data.length - 1)) * 280;
        const y = 60 + ((maxValue - d.y) / range) * 120;
        return `${x},${y}`;
    }).join(' ');

    return (
        <div className="bg-white border rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
                <div className="flex gap-6 text-sm">
                    <div>
                        <span className="text-gray-500 font-robert-regular">Total: </span>
                        <span className="font-bold font-general">${total.toLocaleString()}</span>
                    </div>
                    <div>
                        <span className="text-gray-500">Promedio: </span>
                        <span className="font-bold font-general">${average.toLocaleString()}</span>
                    </div>
                    <div>
                        <span className="text-gray-500">Tendencia: </span>
                        <span className={`font-bold font-general ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                            {trend === 'up' ? '↗️ Creciendo' : '↘️ Bajando'}
                        </span>
                    </div>
                </div>
            </div>

            <svg width="100%" height="200" viewBox="0 0 400 200" className="overflow-visible">
                {/* Grid */}
                {[0, 1, 2, 3, 4].map(i => (
                    <line
                        key={i}
                        x1="60"
                        y1={60 + i * 30}
                        x2="340"
                        y2={60 + i * 30}
                        stroke="#F3F4F6"
                        strokeWidth="1"
                    />
                ))}

                {/* Data Line */}
                <polyline
                    points={points}
                    fill="none"
                    stroke="#000000"
                    strokeWidth="2.5"
                    className="drop-shadow-sm"
                />

                {/* Data Points with Hover */}
                {data.map((d, i) => {
                    const x = 60 + (i / (data.length - 1)) * 280;
                    const y = 60 + ((maxValue - d.y) / range) * 120;
                    return (
                        <g key={i}>
                            <circle
                                cx={x}
                                cy={y}
                                r="4"
                                fill="#000000"
                                stroke="#FFFFFF"
                                strokeWidth="2"
                                className="hover:r-6 transition-all cursor-pointer"
                            />
                            <title>{`${d.x}: $${d.y.toLocaleString()}`}</title>
                        </g>
                    );
                })}

                {/* Axis Labels */}
                <text x="200" y="195" textAnchor="middle" className="text-xs fill-gray-600">
                    Período
                </text>
                <text x="25" y="125" textAnchor="middle" className="text-xs fill-gray-600" transform="rotate(-90 25 125)">
                    Ingresos
                </text>
            </svg>
        </div>
    );
});

RevenueChart.displayName = 'RevenueChart';
BusinessChart.displayName = 'BusinessChart';