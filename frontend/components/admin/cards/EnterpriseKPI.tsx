import { TrendingUp } from "lucide-react";

const EnterpriseKPI = ({ icon: Icon, title, value, subtitle, trend, onClick }: {
    icon: any;
    title: string;
    value: string | number;
    subtitle: string;
    trend?: 'up' | 'down' | 'neutral';
    onClick?: () => void;
}) => (
    <button
        className="group border border-gray-100 hover:border-black p-6 transition-all duration-300 cursor-pointer"
        onClick={onClick}
        aria-label={`${title}: ${value}`}
    >
        <div className="flex items-center justify-between mb-4">
            <Icon className="h-6 w-6 text-gray-600 group-hover:text-black transition-colors" />
            {trend && (
                <TrendingUp className={`h-4 w-4 ${trend === 'up' ? 'text-green-500' :
                    trend === 'down' ? 'text-red-500' : 'text-gray-400'
                    }`} />
            )}
        </div>
        <h3 className="font-robert-medium text-sm text-gray-600 uppercase tracking-wider">{title}</h3>
        <p className="font-robert-medium text-2xl font-bold mt-2">{value}</p>
        <p className="font-robert-regular text-xs text-gray-500 mt-1">{subtitle}</p>
    </button>
);

export default EnterpriseKPI;