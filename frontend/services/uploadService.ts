// services/uploadService.ts
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export class UploadService {
    static async uploadImage(file: File): Promise<string> {
        try {
            const formData = new FormData();
            formData.append('image', file);

            const response = await axios.post(`${API_URL}/api/v1/upload`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (!response.data.success) {
                throw new Error('Error al subir la imagen');
            }

            // Aseguramos que la ruta devuelta sea correcta
            const imagePath = response.data.path;
            return imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
        } catch (error) {
            console.error('Error uploading image:', error);
            throw error;
        }
    }

    static getImageUrl(path: string): string {
        if (!path) return '/assets/images/demo/default-product.jpg';
        
        // Si es una ruta relativa válida, la usamos directamente
        if (path.startsWith('/assets/')) {
            return path;
        }

        // Para compatibilidad con imágenes antiguas
        if (path.startsWith('http')) return path;
        
        return `/assets/images/demo/${path}`;
    }
}