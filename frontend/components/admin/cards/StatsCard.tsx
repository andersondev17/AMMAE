import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/form/card";
import { cn } from "@/lib/utils";
import { TrendingDown, TrendingUp } from "lucide-react";

type StatsCardProps = Readonly<{
    title: string;
    value: string;
    icon?: React.ReactNode;
    className?: string;
    description?: string;
    trend?: 'up' | 'down' | 'neutral';
    change?: string;
}>;

export function StatsCard({ title, value, icon, className, description, trend = 'neutral', change}: StatsCardProps) {
    const trendIcon = trend === 'up' ? <TrendingUp className="h-3 w-3" />
        : trend === 'down' ? <TrendingDown className="h-3 w-3" />
            : null;

    const trendColor = trend === 'up' ? 'text-green-600'
        : trend === 'down' ? 'text-red-600'
            : 'text-gray-500';

    return (
        <Card className={cn("overflow-hidden hover:shadow-md transition-all duration-300", className)}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium font-robert-medium text-gray-600">{title}</CardTitle>
                <div className="size-8 rounded-full p-1.5 text-gray-700">
                    {icon}
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold font-general">{value}</div>
                {(description || change) && (
                    <div className="flex items-center justify-between mt-2">
                        {description && (
                            <p className="text-xs text-gray-500">{description}</p>
                        )}
                        {change && (
                            <div className={cn("flex items-center gap-1 text-xs", trendColor)}>
                                {trendIcon}
                                <span>{change}</span>
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}