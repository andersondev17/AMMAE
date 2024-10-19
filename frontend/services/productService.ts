import axios from 'axios';
import { Product } from '../types';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getProducts = async (
  page = 1,
  limit = 12,
  sort = '',
  categoria = '',
  search = '',
  fields = ''
): Promise<{ data: Product[]; count: number }> => {
  try {
    console.log('Fetching products from:', `${API_URL}/productos`);
    const response = await axios.get(`${API_URL}/productos`, {
      params: { page, limit, sort, categoria, search, fields },
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