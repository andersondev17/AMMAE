'use client';

import AuthForm from '@/components/AuthForm';
import { useAuth } from '@/hooks/useAuth';
import { LoginFormValues, loginSchema } from '@/lib/validations/auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const defaultValues = {
    email: '',
    password: ''
};

export default function LoginPage() {
    const { login, isAuthenticated, isLoading, sessionStatus } = useAuth();
    const router = useRouter();
    const [formSubmitting, setFormSubmitting] = useState(false);

    useEffect(() => {
        if (sessionStatus === 'authenticated') {
            router.push('/');
        }
    }, [sessionStatus, router]);

    const handleLogin = async (data: LoginFormValues) => {
    setFormSubmitting(true);
    
    try {
        const result = await login({
            email: data.email,
            password: data.password
        });
        
        if (result.success) {
            toast.success('¡Inicio de sesión exitoso!');
            router.push('/');
        } else {
            let errorMessage = result.error;
    
            // Si el error menciona "rate" o contiene 429, es un límite de tasa
            if (errorMessage?.toLowerCase().includes('demasiados') || 
                errorMessage?.toLowerCase().includes('espera')) {
                errorMessage = 'Has excedido el número de intentos. Por favor, espera unos minutos.';
            }
            
            toast.error(errorMessage);
        }
        
        return result;
    } catch (error) {
        // Simplificar mensaje de error para el usuario
        toast.error('Error de conexión. Verifica tu internet e intenta de nuevo.');
        
        return {
            success: false,
            error: 'Error de conexión'
        };
    } finally {
        setFormSubmitting(false);
    }
};

    if (isLoading && !formSubmitting) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-md mx-auto p-6">
            <AuthForm
                type="LOGIN"
                schema={loginSchema}
                defaultValues={defaultValues}
                onSubmit={handleLogin}
                isLoading={isLoading || formSubmitting}
            />
        </div>
    );
}