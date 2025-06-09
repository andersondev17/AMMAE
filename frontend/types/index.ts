// @/types/index.ts - CLEAN SEPARATION OF CONCERNS

import { useRouter } from "next/navigation";
import { AuthUser } from "./auth.types";

// ===== PRODUCT CONSTANTS =====
export const PRODUCT_CATEGORIES = [
  'Jeans', 'Blusas', 'Vestidos', 'Faldas', 'Accesorios'
] as const;

export const PRODUCT_SIZES = [
  'XS', 'S', 'M', 'L', 'XL', 'XXL'
] as const;

export type ProductCategory = typeof PRODUCT_CATEGORIES[number];
export type ProductSize = typeof PRODUCT_SIZES[number];

// ===== FORM DATA - PURE INPUT (NO COMPUTED FIELDS) =====
export interface ProductFormData {
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: ProductCategory;
  tallas: ProductSize[];
  colores: string[];
  imagenes: string[];
  stock: number;
  enOferta: boolean;
  precioOferta?: number;
  estilo: string;
  material: string;
  // ❌ NO COMPUTED FIELDS - FORM IS FOR INPUT ONLY
}

// ===== PRODUCT WITH COMPUTED FIELDS (FOR DISPLAY) =====
export interface Product extends ProductFormData {
  _id: string;
  createdAt: string;
  updatedAt: string;
  selectedSize?: string;
  selectedColor?: string;
  // ✅ COMPUTED FIELDS - ONLY FOR UI PRESENTATION
  precioFormateado?: string; 
  descuentoPorcentaje?: number; 
  precioOfertaFormateado?: string; 
}

// ===== FORM INPUT TYPE =====
export interface ProductFormInput {
  nombre: string;
  descripcion: string;
  precio: number | string;
  categoria: string;
  tallas: string[];
  colores: string[];
  imagenes: string[];
  stock: number | string;
  enOferta: boolean;
  precioOferta?: number | string;
  estilo: string;
  material: string;
}

// ===== API RESPONSE =====
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  count?: number;
  pagination?: {
    page: number;
    totalPages: number;
  };
}

// ===== COMPONENT PROPS =====
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

export interface AddProductFormProps {
  initialData?: Product | null;
  onSubmit: (data: ProductFormData) => Promise<void>;
  isSubmitting?: boolean;
}

// ===== FILTER AND SEARCH =====
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

// ===== UI COMPONENT TYPES =====
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

// ===== CATEGORY TYPES =====
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

// ===== HERO =====
export interface VideoHeroProps {
  placeholderImage: string;
  title: string;
  subtitle?: string;
  ctaText?: string;
  onCtaClick?: () => void;
  onLoad?: () => void;
}
