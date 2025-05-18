// @/types/index.ts

import { useRouter } from "next/navigation";
import { AuthUser } from "./auth.types";


export interface Product {
  _id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: 'Jeans' | 'Blusas' | 'Vestidos' | 'Faldas' | 'Accesorios';
  tallas: Array<'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL'>;
  colores: string[];
  imagenes: string[];
  stock: number;
  enOferta: boolean;
  precioOferta?: number;
  estilo: string;
  material: string;
  createdAt: string;
  updatedAt: string;
  selectedSize?: string;
  selectedColor?: string; 

}

export interface CartIconProps {
  onOpen: () => void;
  itemCount: number;
  textColor: string;
}
export interface SearchIconProps {
  isOpen: boolean;
  toggle: () => void;
  color: string;
}
export interface AuthLinkProps {
  textColor: string;
}
export interface NavLinkProps {
  href: string;
  currentPath: string;
  isHome: boolean;
  textColor: string;
  children: React.ReactNode;
}
export interface SearchPanelProps {
  isOpen: boolean;
  searchTerm: string;
  handleSearch: (value: string) => void;
  handleClear: () => void;
  isLoading: boolean;
}
export interface UserMenuProps {
  user: AuthUser | null;
  isAdmin: boolean;
  router: ReturnType<typeof useRouter>;
  logout: () => Promise<void>;
}
export interface Category {
  id: ProductCategory;
  name: string;
  image: string;
  description: string;
  link: string;
}
export type CategoryCardProps = {
  category: Category;
  index: number;
};
export interface VideoHeroProps {
    placeholderImage: string;
    title: string;
    subtitle?: string;
    ctaText?: string;
    onCtaClick?: () => void;
		onLoad?: () => void
}

// Nueva interfaz para el formulario de entrada
export interface ProductFormInput {
  nombre: string;
  descripcion: string;
  precio: number | string; // Permitimos string para el manejo del formulario
  categoria: string; // String simple para el formulario
  tallas: string[]; // Array de strings para el formulario
  colores: string[];
  imagenes: string[];
  stock: number | string; // Permitimos string para el manejo del formulario
  enOferta: boolean;
  precioOferta?: number | string; // Opcional y permitimos string
  estilo: string;
  material: string;
}

export type ProductFormData = Omit<Product, '_id' | 'createdAt' | 'updatedAt'> & {
  imagenes?: string[]; //  imagenes opcional
};
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  count?: number;
  pagination?: {
    page: number;
    totalPages: number;
  };
}

export interface ProductListProps {
  products: Product[];
  isLoading: boolean;
  error: Error | null;
  onDelete?: (id: string) => Promise<void>;
  onEdit?: (product: Product) => void;
  isAdminView?: boolean;
  isDeleting?: boolean;
}

export interface ProductCardProps {
  product: Product;
  onEdit?: (product: Product) => void;
  onDelete?: (id: string) => Promise<void>;
  isAdminView?: boolean;
}

export interface ProductFilters {
  page?: number;
  limit?: number;
  sortBy?: string;
  categoria?: string;
  search?: string;
  stock?: 'inStock' | 'lowStock' | 'outOfStock';
  enOferta?: boolean;
  tallas?: string;
  color?: string;
  precioMin?: string;
  precioMax?: string;
  fields: string;
}

export interface AddProductFormProps {
  initialData?: Product | null;
  onSubmit: (data: ProductFormData) => Promise<void>;
  isSubmitting?: boolean;
}

// Constantes para las categorías y tallas
export const PRODUCT_CATEGORIES = [
  'Jeans',
  'Blusas',
  'Vestidos',
  'Faldas',
  'Accesorios',
] as const;

export const PRODUCT_SIZES = [
  'XS',
  'S',
  'M',
  'L',
  'XL',
  'XXL',
] as const;

// Type helpers
export type ProductCategory = typeof PRODUCT_CATEGORIES[number];
export type ProductSize = typeof PRODUCT_SIZES[number];