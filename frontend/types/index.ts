export interface Product {
  _id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: string;
  tallas: string[];
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