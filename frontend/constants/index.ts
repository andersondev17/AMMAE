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
        img: "/assets/icons/admin/hanger.svg",
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
        img: "/assets/icons/admin/sale.svg",
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

export const PRODUCT_ACCORDION_CONFIG = [
    {
        value: "details",
        title: "Detalles del producto",
        type: "product_details",
        fields: ["descripcion", "material", "estilo"]
    },
    {
        value: "shipping",
        title: "Envío y entrega",
        type: "text",
        content: "Envío gratuito a partir de $99. Entrega estimada de 3-5 días hábiles."
    },
    {
        value: "returns",
        title: "Devoluciones",
        type: "text",
        content: "Tienes 30 días para devolver el producto sin cargo adicional."
    },
    {
        value: "care",
        title: "Cuidado del producto",
        type: "care_instructions",
        instructions: [
            "Lavar a máquina en agua fría",
            "No usar blanqueador",
            "Secar al aire libre",
            "Planchar a temperatura media"
        ]
    }
] as const;


export const FIELD_TYPES: Record<string, string> = {
    email: "email",
    password: "password",
    confirmPassword: "password",
    username: "text",
    firstName: "text",
    lastName: "text",
};

export const FIELD_LABELS: Record<string, string> = {
    email: "Correo electrónico",
    password: "Contraseña",
    confirmPassword: "Confirmar contraseña",
    username: "Nombre de usuario",
    firstName: "Nombre",
    lastName: "Apellido",
};