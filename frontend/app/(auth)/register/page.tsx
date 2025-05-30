'use client';

import AuthForm from '@/components/AuthForm';
import { useAuth } from '@/hooks/useAuth';
import { registerSchema } from '@/lib/validations/auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function RegisterPage() {
    const { register, isAuthenticated, isLoading } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (isAuthenticated && !isLoading) {
            router.push('/');
        }
    }, [isAuthenticated, isLoading, router]);

    const handleRegister = async (data: { email: string; password: string; confirmPassword: string; }) => {
        setIsSubmitting(true);

        try {
            if (data.password !== data.confirmPassword) {
                setIsSubmitting(false);
                return { success: false, error: 'Las contraseñas no coinciden' };
            }

            const result = await register({
                email: data.email,
                password: data.password
            });

            setIsSubmitting(false);
            
            if (result.success) {
                toast.success('Cuenta creada exitosamente');
                router.push('/login');
            } else {
                toast.error(result.error || 'Error al crear la cuenta');
            }
            
            return result;
        } catch (error) {
            setIsSubmitting(false);
            
            const errorMessage = error instanceof Error 
                ? error.message 
                : 'Error inesperado';
                
            toast.error(errorMessage);
            
            return {
                success: false,
                error: errorMessage
            };
        }
    };

    if (isLoading) {
        return <div className="flex justify-center items-center min-h-screen">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-600"></div>
        </div>;
    }

    return (
        <AuthForm
            type="REGISTER"
            schema={registerSchema}
            defaultValues={{ email: '', password: '', confirmPassword: '' }}
            onSubmit={handleRegister}
            isLoading={isSubmitting || isLoading}
        />
    );
}