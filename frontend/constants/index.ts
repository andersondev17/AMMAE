import { Category } from "@/types";

export const headerLinks = [
    {
        label: 'Home',
        route: '/',
    },
    {
        label: 'Create Event',
        route: '/events/create',
    },
    {
        label: 'My Profile',
        route: '/profile',
    },
]
export const adminSideBarLinks = [
    {
        img: "/assets/icons/admin/home.svg",
        route: "/admin/dashboard",
        text: "Home",
    },
    {
        img: "/assets/icons/admin/users.svg",
        route: "/admin/users",
        text: "Usuarios",
    },
    {
        img: "/icons/admin/book.svg",
        route: "/admin/products",
        text: "Productos",
    },
    {
        img: "/assets/icons/admin/caret-up.svg",
        route: "/admin/products?filter=inStock",
        text: "En Stock",
    },
    {
        img: "/assets/icons/admin/caret-down.svg",
        route: "/admin/products?filter=lowStock",
        text: "Bajo Stock",
    },
    {
        img: "/assets/icons/warning.svg",
        route: "/admin/products?filter=outOfStock",
        text: "Sin Stock",
    },
    {
        img: "/assets/icons/heart.svg",
        route: "/admin/products?filter=onSale",
        text: "En Oferta",
    },

];


export const FILTERS = [
    { id: null, label: 'Todos los productos' },
    { id: 'inStock', label: 'En stock' },
    { id: 'lowStock', label: 'Bajo stock' },
    { id: 'outOfStock', label: 'Sin stock' },
    { id: 'onSale', label: 'En oferta' }
];

export const COLOR_MAP: Record<string, string> = {
    'Negro': '#000000',
    'Blanco': '#FFFFFF',
    'Azul': '#2563EB',
    'Rojo': '#DC2626',
    'Verde': '#059669',
    'Amarillo': '#CA8A04',
    'Morado': '#7C3AED',
    'Rosa': '#DB2777',
    'Gris': '#4B5563',
    'Beige': '#D4B89C'
};
export const mainCategories = [
    { name: 'JEANS', path: '/categoria/jeans', apiValue: 'Jeans' },
    { name: 'BLUSAS', path: '/categoria/blusas', apiValue: 'Blusas' },
    { name: 'VESTIDOS', path: '/categoria/vestidos', apiValue: 'Vestidos' },
    { name: 'ACCESORIOS', path: '/categoria/accesorios', apiValue: 'Accesorios' },
] as const;

export const navCategories = [
    { name: 'MUJER', path: '/categoria/jeans', apiValue: 'Hombre' },
    { name: 'SALE', path: '/sale', apiValue: 'Sale' },
] as const;


export const categories: Category[] = [
    {
        id: 'Jeans',
        name: 'JEANS',
        image: '/assets/images/demo/jeans/jean-1.jpg',
        description: 'Colección exclusiva de jeans',
        link: '/categoria/jeans'
    },
    {
        id: 'Blusas',
        name: 'BLUSAS',
        image: '/assets/images/demo/blusas/blusa-floral-1.jpg',
        description: 'Blusas para toda ocasión',
        link: '/categoria/blusas'
    },
    {
        id: 'Vestidos',
        name: 'VESTIDOS',
        image: '/assets/images/demo/vestidos/vestido-1.png',
        description: 'Vestidos elegantes',
        link: '/categoria/vestidos'
    },
    {
        id: 'Accesorios',
        name: 'ACCESORIOS',
        image: '/assets/images/demo/accesorios/accesorio-1.png',
        description: 'Complementa tu estilo',
        link: '/categoria/accesorios'
    }
];

//authform 
// Definición de tipos para campos
export const FIELD_TYPES: Record<string, string> = {
    email: "email",
    password: "password",
    confirmPassword: "password",
    username: "text",
    firstName: "text",
    lastName: "text",
};

// Definición de etiquetas para campos
export const FIELD_LABELS: Record<string, string> = {
    email: "Correo electrónico",
    password: "Contraseña",
    confirmPassword: "Confirmar contraseña",
    username: "Nombre de usuario",
    firstName: "Nombre",
    lastName: "Apellido",
};