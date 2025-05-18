'use client';

import { AuthService } from '@/services/authService';
import { AuthSubmitResult } from '@/types/auth.types';
import { AuthUser } from '@/types/next-auth';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

export function useAuth() {
    const { data: session, status, update } = useSession();
    const router = useRouter();

    const login = useCallback(async (credentials: { email: string; password: string }): Promise<AuthSubmitResult> => {
        try {
            const result = await signIn('credentials', {
                redirect: false,
                email: credentials.email,
                password: credentials.password
            });

            if (result?.error) {
                
                if (result.error === "Configuration") {
                    return {
                        success: false,
                        error: "Credenciales incorrectas"
                    };
                }

                return { success: false, error: result.error };
            }

            await new Promise(resolve => setTimeout(resolve, 500));
            await update();

            return { success: true };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error de conexión';
            return {
                success: false,
                error: errorMessage
            };
        }
    }, [update]);

    const register = useCallback(async (userData: { email: string; password: string }): Promise<AuthSubmitResult> => {
        try {
            const result = await AuthService.register(userData);
            return result;
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Error al registrar'
            };
        }
    }, []);

    const logout = useCallback(async () => {
        try {
            await signOut({ redirect: false });
            router.push('/login');
        } catch (error) {
            console.error('Logout error:', error);
        }
    }, [router]);

    return {
        user: session?.user as AuthUser | null,
        isAuthenticated: !!session?.user,
        isAdmin: session?.user?.role === 'admin',
        isLoading: status === 'loading',
        login,
        register,
        logout,
        session,
        sessionStatus: status
    };
}