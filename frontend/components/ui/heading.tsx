// components/ui/heading.tsx
interface HeadingProps {
    title: string;
    description?: string;
}

export function Heading({ title, description }: HeadingProps) {
    return (
        <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
            {description && <p className="text-sm text-gray-500">{description}</p>}
        </div>
    );
}