// types/product.types.ts
export interface Product {
    _id: string;
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
    createdAt: string;
    updatedAt: string;
  }
  
  export type ProductCategory = typeof PRODUCT_CATEGORIES[number];
  export type ProductSize = typeof PRODUCT_SIZES[number];
  
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