'use client';

import { AuthService } from '@/services/authService';
import { AuthSubmitResult } from '@/types/auth.types';
import { AuthUser } from '@/types/next-auth';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';

export function useAuth() {
    const { data: session, status, update } = useSession();
    const router = useRouter();
    const [lastError, setLastError] = useState<string | null>(null);

    const login = useCallback(async (credentials: { email: string; password: string }): Promise<AuthSubmitResult> => {
        try {
            setLastError(null);
            
            const result = await signIn('credentials', {
                redirect: false,
                email: credentials.email,
                password: credentials.password
            });

            if (result?.error) {
                setLastError(result.error);
                return { success: false, error: result.error };
            }

            await new Promise(resolve => setTimeout(resolve, 500));
            await update();

            return { success: true };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error de conexión';
            setLastError(errorMessage);
            
            return {
                success: false,
                error: errorMessage
            };
        }
    }, [update]);

    const register = useCallback(async (userData: { email: string; password: string }): Promise<AuthSubmitResult> => {
        try {
            setLastError(null);
            const result = await AuthService.register(userData);
            
            if (!result.success && result.error) {
                setLastError(result.error);
            }
            
            return result;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error al registrar';
            setLastError(errorMessage);
            
            return {
                success: false,
                error: errorMessage
            };
        }
    }, []);

    const logout = useCallback(async () => {
        try {
            await signOut({ redirect: false });
            router.push('/login');
        } catch (error) {
            console.error('Error en logout:', error);
        }
    }, [router]);

    return {
        user: session?.user as AuthUser | null,
        isAuthenticated: !!session?.user,
        isAdmin: session?.user?.role === 'admin',
        isLoading: status === 'loading',
        error: lastError,
        login,
        register,
        logout,
        session,
        sessionStatus: status
    };
}