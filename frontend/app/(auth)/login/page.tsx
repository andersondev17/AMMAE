// Archivo: app/login/page.tsx
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

    // Redirección automática si ya está autenticado
    useEffect(() => {
        if (sessionStatus === 'authenticated') {
            router.push('/');
        }
    }, [sessionStatus, router]);

    const handleLogin = async (data: LoginFormValues) => {
        setFormSubmitting(true);
        
        try {
            console.log('LoginPage: Iniciando proceso de login con:', data.email);
            
            const result = await login({
                email: data.email,
                password: data.password
            });
            
            console.log('LoginPage: Resultado de login:', result);
            
            if (result.success) {
                toast.success('¡Inicio de sesión exitoso!');
                router.push('/');
            } else {
                toast.error(result.error || 'Error al iniciar sesión');
            }
            
            return result;
        } catch (error) {
            console.error('LoginPage: Error inesperado:', error);
            
            const errorMessage = error instanceof Error 
                ? error.message 
                : 'Error de conexión';
                
            toast.error(errorMessage);
            
            return {
                success: false,
                error: errorMessage
            };
        } finally {
            setFormSubmitting(false);
        }
    };

    // Estado de carga básico
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