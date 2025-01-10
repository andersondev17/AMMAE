import { Product, ProductFilters, ProductFormData } from '@/types';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

axios.defaults.baseURL = API_URL;
axios.defaults.headers.common['Content-Type'] = 'application/json';

// services/productService.ts

export const getProducts = async (filters: Partial<ProductFilters>) => {
  try {
    const baseUrl = `${API_URL}/productos`;
    const queryString = new URLSearchParams();

    // Mapear los filtros a parámetros de consulta
    if (filters.page) queryString.append('page', filters.page.toString());
    if (filters.limit) queryString.append('limit', filters.limit.toString());
    if (filters.sortBy) queryString.append('sort', filters.sortBy);
    if (filters.categoria) queryString.append('categoria', filters.categoria);
    if (filters.search) queryString.append('search', filters.search);
    if (filters.stock) queryString.append('stock', filters.stock);
    if (filters.enOferta) queryString.append('enOferta', 'true');

    const url = `${baseUrl}?${queryString.toString()}`;
    console.log('Requesting URL:', url);
      
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const getProductById = async (id: string) => {
  const response = await axios.get(`${API_URL}/productos/${id}`);
  return response.data;
};

export const createProduct = async (productData: ProductFormData): Promise<Product> => {
  try {
      console.log('ProductService - Iniciando creación de producto:', productData);
      
      const endpoint = `${API_URL}/productos`;
      console.log('ProductService - Usando endpoint:', endpoint);
        
      const formattedData = {
          ...productData,
          precio: Number(productData.precio),
          stock: Number(productData.stock),
          precioOferta: productData.enOferta ? Number(productData.precioOferta) : undefined,
          nombre: productData.nombre.trim(),
          descripcion: productData.descripcion.trim(),
          categoria: productData.categoria,
          tallas: productData.tallas || [],
          colores: productData.colores || [],
          estilo: productData.estilo?.trim(),
          material: productData.material?.trim(),
          imagenes: productData.imagenes || []
      };
      
      console.log('ProductService - Datos formateados:', formattedData);
      
      const response = await axios.post<{ success: boolean; data: Product }>(
          endpoint,
          formattedData,
          {
              headers: {
                  'Content-Type': 'application/json'
              }
          }
      );
      
      console.log('ProductService - Respuesta del servidor:', response.data);
      
      if (!response.data.success) {
        throw new Error('Error al crear el producto');
    }
      
      return response.data.data;
  } catch (error: any) {
      console.error('ProductService - Error detallado:', error);
      throw new Error(error.response?.data?.message || 'Error al crear el producto');
  }
};

export const updateProduct = async (id: string, data: ProductFormData): Promise<Product> => {
  try {
    console.log('ProductService - Iniciando actualización de producto:', { id, data });
    
    const endpoint = `${API_URL}/productos/${id}`;
    console.log('ProductService - Usando endpoint:', endpoint);
    
    const formattedData = {
      ...data,
      precio: Number(data.precio),
      stock: Number(data.stock),
      precioOferta: data.enOferta ? Number(data.precioOferta) : undefined,
      nombre: data.nombre.trim(),
      descripcion: data.descripcion.trim(),
      categoria: data.categoria,
      tallas: data.tallas || [],
      colores: data.colores || [],
      estilo: data.estilo?.trim(),
      material: data.material?.trim(),
      imagenes: data.imagenes || []
    };

    console.log('ProductService - Datos formateados:', formattedData);

    const response = await axios.put<{ success: boolean; data: Product }>(
      endpoint,
      formattedData,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('ProductService - Respuesta del servidor:', response.data);

    if (!response.data.success) {
      throw new Error('Error al actualizar el producto');
    }

    return response.data.data;
  } catch (error: any) {
    console.error('ProductService - Error en actualización:', error);
    throw new Error(error.response?.data?.message || 'Error al actualizar el producto');
  }
};

export const deleteProduct = async (id: string) => {
  const response = await axios.delete(`${API_URL}/productos/${id}`);
  return response.data;
};

export const productService = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};