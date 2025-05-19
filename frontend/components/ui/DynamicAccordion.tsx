// components/ui/DynamicAccordion.tsx
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { memo, ReactNode } from 'react';

export interface AccordionItemData {
    value: string;
    title: ReactNode;
    content: ReactNode;
}

type AccordionTypes = {
    single: { type: 'single'; collapsible?: boolean; value?: string; defaultValue?: string; onValueChange?: (value: string) => void };
    multiple: { type: 'multiple'; value?: string[]; defaultValue?: string[]; onValueChange?: (value: string[]) => void };
};

type DynamicAccordionProps = {
    items: AccordionItemData[];
    className?: string;
} & (AccordionTypes['single'] | AccordionTypes['multiple']);

/**
 * Componente de acordeón dinámico que maneja correctamente tipos para modo 'single' o 'multiple'
 */
const DynamicAccordion = memo(({ items, className, ...props }: DynamicAccordionProps) => {
    // Para 'single' type, defaultValue debe ser string
    // Para 'multiple' type, defaultValue debe ser string[]
    return (
        <Accordion className={className} {...props}>
            {items.map(({ value, title, content }) => (
                <AccordionItem key={value} value={value} className="border-b border-gray-100">
                    <AccordionTrigger className="py-4 text-sm font-medium">
                        {title}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-gray-600">
                        {content}
                    </AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
    );
});

DynamicAccordion.displayName = 'DynamicAccordion';
export default DynamicAccordion;