// utils/colors.ts

export const COLOR_MAP = {
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
} as const;

export const getColorValue = (colorName: string): string => {
    return COLOR_MAP[colorName as keyof typeof COLOR_MAP] || colorName;
};

export const isLightColor = (colorValue: string): boolean => {
    // Colores que necesitan texto oscuro
    const lightColors = ['#FFFFFF', '#D4B89C', '#CA8A04'];
    return lightColors.includes(colorValue);
};