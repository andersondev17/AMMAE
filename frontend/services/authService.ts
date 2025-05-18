// authService.ts
import { AuthSubmitResult } from '@/types/auth.types';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const apiClient = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: { 'Content-Type': 'application/json' }
});

export const AuthService = {
    login: async (credentials: { email: string; password: string }): Promise<AuthSubmitResult> => {
        try {
            const response = await apiClient.post('/auth/login', credentials);
            return response.data;
        } catch (error: any) {
            return {
                success: false,
                error: error.response?.data?.error || 'Error de conexión'
            };
        }
    },

    register: async (userData: { email: string; password: string }): Promise<AuthSubmitResult> => {
        try {
            const response = await apiClient.post('/auth/register', userData);
            return response.data;
        } catch (error: any) {
            return {
                success: false,
                error: error.response?.data?.error || 'Error al registrar usuario'
            };
        }
    },

    logout: async () => {
        try {
            await apiClient.get('/auth/logout');
            return { success: true };
        } catch (error) {
            return { success: false };
        }
    },

    getCurrentUser: async () => {
        try {
            const response = await apiClient.get('/auth/me');
            return response.data;
        } catch (error) {
            return { success: false };
        }
    }
}