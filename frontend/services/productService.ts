import { Product } from '@/types';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export const getProducts = async (
  page = 1,
  limit = 12,
  sortBy = '',
  categoria = '',
  search = '',
  fields = ''
): Promise<{ data: Product[]; count: number }> => {
  try {
    console.log('Fetching products from:', `${API_URL}/productos`);
    const response = await axios.get(`${API_URL}/productos`, {
      params: { 
        page, 
        limit, 
        sort: sortBy, 
        categoria, 
        search, 
        fields 
      }
    });

    console.log('API Response:', response.data);
    return {
      data: response.data.data,
      count: response.data.count
    };
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const getProductById = async (id: string) => {
  const response = await axios.get(`${API_URL}/productos/${id}`);
  return response.data;
};

export const createProduct = async (data: Product) => {
  const response = await axios.post(`${API_URL}/productos`, data);
  return response.data;
};

export const updateProduct = async (id: string, data: Product) => {
  const response = await axios.put(`${API_URL}/productos/${id}`, data);
  return response.data;
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