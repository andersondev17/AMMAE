// components/product/ProductAccordions.tsx
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Product } from '@/types';
import { memo } from 'react';

interface ProductAccordionsProps {
    product: Product;
}

const ProductAccordions = memo(({ product }: ProductAccordionsProps) => {
    return (
        <Accordion type="multiple" defaultValue={['details']} className="mt-6">
            <AccordionItem value="details">
                <AccordionTrigger>Detalles del producto</AccordionTrigger>
                <AccordionContent>
                    <div className="prose prose-sm max-w-none text-gray-700">
                        <p>{product.descripcion}</p>
                        <ul className="space-y-2 mt-2">
                            <li><strong>Material:</strong> {product.material}</li>
                            <li><strong>Estilo:</strong> {product.estilo}</li>
                        </ul>
                    </div>
                </AccordionContent>
            </AccordionItem>

            <AccordionItem value="shipping">
                <AccordionTrigger>Envío y entrega</AccordionTrigger>
                <AccordionContent>
                    <p className="text-gray-700">
                        Envío gratuito a partir de $99. Entrega estimada de 3-5 días hábiles.
                    </p>
                </AccordionContent>
            </AccordionItem>

            <AccordionItem value="returns">
                <AccordionTrigger>Devoluciones</AccordionTrigger>
                <AccordionContent>
                    <p className="text-gray-700">
                        Tienes 30 días para devolver el producto sin cargo adicional.
                    </p>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
});

ProductAccordions.displayName = 'ProductAccordions';

export default ProductAccordions;