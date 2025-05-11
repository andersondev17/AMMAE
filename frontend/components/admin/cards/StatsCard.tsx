// components/admin/cards/StatsCard.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/form/card";
import { cn } from "@/lib/utils";
import { ArrowDown, ArrowUp, Minus } from "lucide-react";

interface StatsCardProps {
    title: string;
    value: string;
    description?: string;
    icon?: React.ReactNode;
    trend?: 'up' | 'down' | 'neutral';
    className?: string;
}

export function StatsCard({ title, value, description, icon, trend = 'neutral', className }: StatsCardProps) {
    return (
        <Card className={cn("overflow-hidden hover:shadow-md transition-all duration-300", className)}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
                <div className="size-8 rounded-full p-1.5 text-gray-700">
                    {icon}
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                {description && (
                    <div className="mt-1 flex items-center text-xs">
                        {trend === 'up' && <ArrowUp className="mr-1 size-3 text-green-500" />}
                        {trend === 'down' && <ArrowDown className="mr-1 size-3 text-red-500" />}
                        {trend === 'neutral' && <Minus className="mr-1 size-3 text-gray-500" />}
                        <CardDescription className={cn(
                            trend === 'up' && "text-green-500",
                            trend === 'down' && "text-red-500"
                        )}>
                            {description}
                        </CardDescription>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}