// frontend/components/checkout/forms/ShippingForm.tsx
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form/form';
import { Input } from '@/components/ui/form/input';
import { Separator } from '@/components/ui/form/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { CheckoutFormValues } from '@/lib/validations/checkoutFormSchema';
import { UseFormReturn } from 'react-hook-form';

interface ShippingFormProps {
    form: UseFormReturn<CheckoutFormValues>;
    onSubmit?: (data: CheckoutFormValues) => void; // add this line

}

export function ShippingForm({ form }: ShippingFormProps) {
    return (
        <>
            <div className="space-y-4">
                <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nombre completo</FormLabel>
                            <FormControl>
                                <Input placeholder="John Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input type="email" placeholder="johndoe@example.com" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Teléfono</FormLabel>
                                <FormControl>
                                    <Input type="tel" placeholder="(123) 456-7890" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <Separator />

                <FormField
                    control={form.control}
                    name="address.street"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Dirección</FormLabel>
                            <FormControl>
                                <Input placeholder="Calle Principal 123" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                        control={form.control}
                        name="address.city"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Ciudad</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ciudad" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="address.state"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Estado</FormLabel>
                                <FormControl>
                                    <Input placeholder="Estado" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="address.zipCode"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Código postal</FormLabel>
                                <FormControl>
                                    <Input placeholder="12345" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <Separator />

                <FormField
                    control={form.control}
                    name="shippingMethod"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Método de envío</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccione método de envío" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="standard">Estándar (5-7 días)</SelectItem>
                                    <SelectItem value="express">Express (2-3 días)</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="saveAddress"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                    Guardar información
                                </FormLabel>
                                <FormDescription>
                                    Guardar dirección para futuras compras
                                </FormDescription>
                            </div>
                            <FormControl>
                                <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
            </div>
        </>
    );
}