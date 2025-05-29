import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/form/card";
import { cn } from "@/lib/utils";

interface StatsCardProps {
    title: string;
    value: string;
    icon?: React.ReactNode;
    className?: string;
}

export function StatsCard({ title, value, icon, className }: StatsCardProps) {
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
            </CardContent>
        </Card>
    );
}