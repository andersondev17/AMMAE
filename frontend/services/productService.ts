import { Product, ProductFilters, ProductFormData } from '@/types';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Configuración centralizada de axios
const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' }
});

// adapter para datos del formulario al formato esperado por la API
const formatProductData = (data: ProductFormData) => ({
  ...data,
  precio: Number(data.precio),
  stock: Number(data.stock),
  precioOferta: data.enOferta ? Number(data.precioOferta) : undefined,
  nombre: data.nombre.trim(),
  descripcion: data.descripcion.trim(),
  tallas: data.tallas || [],
  colores: data.colores || [],
  estilo: data.estilo?.trim(),
  material: data.material?.trim(),
  imagenes: data.imagenes || []
});

const buildQueryString = (filters: Partial<ProductFilters>) => {
  const params = new URLSearchParams();
  
  // Mapeo eficiente de filtros a parámetros
  const filterMap: Record<string, any> = {
    page: filters.page?.toString(),
    limit: filters.limit?.toString(),
    sort: filters.sortBy,
    categoria: filters.categoria,
    search: filters.search,
    stock: filters.stock
  };
  
  // Solo parámetros con valor
  Object.entries(filterMap).forEach(([key, value]) => {
    if (value) params.append(key, value);
  });
  
  if (filters.enOferta) params.append('enOferta', 'true');
  
  return params.toString();
};

export const productService = {
  async getProducts(filters: Partial<ProductFilters>) {
    try {
      const queryString = buildQueryString(filters);
      const url = `/productos?${queryString}`;
      
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  async getProductById(id: string) {
    const response = await api.get(`/productos/${id}`);
    return response.data;
  },

  async createProduct(productData: ProductFormData): Promise<Product> {
    try {
      const formattedData = formatProductData(productData);
      const response = await api.post<{ success: boolean; data: Product }>(
        '/productos',
        formattedData
      );
      
      if (!response.data.success) {
        throw new Error('Error al crear el producto');
      }
      
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al crear el producto');
    }
  },

  async updateProduct(id: string, data: ProductFormData): Promise<Product> {
    try {
      const formattedData = formatProductData(data);
      const response = await api.put<{ success: boolean; data: Product }>(
        `/productos/${id}`,
        formattedData
      );

      if (!response.data.success) {
        throw new Error('Error al actualizar el producto');
      }

      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al actualizar el producto');
    }
  },

  async deleteProduct(id: string) {
    const response = await api.delete(`/productos/${id}`);
    return response.data;
  }
};