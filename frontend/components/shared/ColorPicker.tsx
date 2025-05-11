// components/shared/ColorPicker.tsx
import { Check } from 'lucide-react';
import { memo } from 'react';

const COLORS = [
  { name: 'Negro', value: '#000000' },
  { name: 'Blanco', value: '#FFFFFF' },
  { name: 'Azul', value: '#2563EB' },
  { name: 'Rojo', value: '#DC2626' },
  { name: 'Verde', value: '#059669' },
  { name: 'Amarillo', value: '#CA8A04' },
  { name: 'Morado', value: '#7C3AED' },
  { name: 'Rosa', value: '#DB2777' },
  { name: 'Gris', value: '#4B5563' },
  { name: 'Beige', value: '#D4B89C' }
];

interface ColorPickerProps {
  selected: string[];
  onChange: (colors: string[]) => void;
  disabled?: boolean;
}

export const ColorPicker = memo(({ 
  selected = [], 
  onChange, 
  disabled = false 
}: ColorPickerProps) => {
  
  // Función para alternar un color en la selección
  const toggleColor = (colorName: string) => {
    if (disabled) return;
    
    const newSelected = selected.includes(colorName)
      ? selected.filter(c => c !== colorName)
      : [...selected, colorName];
    
    onChange(newSelected);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-800">Colores disponibles</label>
        {selected.length > 0 && (
          <span className="text-xs text-gray-500">
            {selected.length} {selected.length === 1 ? 'color' : 'colores'} seleccionado{selected.length !== 1 && 's'}
          </span>
        )}
      </div>
      
      <div className="grid grid-cols-5 gap-4">
        {COLORS.map(({ name, value }) => {
          const isSelected = selected.includes(name);
          
          return (
            <button
              key={name}
              type="button"
              onClick={() => toggleColor(name)}
              disabled={disabled}
              aria-pressed={isSelected}
              aria-label={`Color ${name} ${isSelected ? 'seleccionado' : ''}`}
              title={name}
              className={` group relative aspect-square rounded-full  transition-all duration-200
                ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer hover:scale-110'}
                ${isSelected 
                  ? 'ring-2 ring-offset-2 ring-black shadow-md' 
                  : 'hover:ring-1 hover:ring-offset-1 hover:ring-gray-300'}
              `}
              style={{ backgroundColor: value }}
            >
              {isSelected && (
                <Check 
                  className={`
                    w-4 h-4 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                    ${value === '#FFFFFF' ? 'text-black' : 'text-white'}
                  `}
                />
              )}
            
            </button>
          );
        })}
      </div>
      
      {/* Campo visual para los colores seleccionados */}
      {selected.length > 0 && (
        <div className="mt-4 pt-3 border-t border-gray-100">
          <div className="flex flex-wrap gap-2">
            {selected.map(colorName => {
              const color = COLORS.find(c => c.name === colorName);
              
              return color ? (
                <div 
                  key={colorName}
                  className="flex items-center px-2 py-1 bg-gray-100 rounded-full text-xs"
                >
                  <span 
                    className="w-3 h-3 rounded-full mr-1.5"
                    style={{ backgroundColor: color.value }}
                  />
                  {colorName}
                  <button
                    onClick={() => toggleColor(colorName)}
                    disabled={disabled}
                    className="ml-1.5 text-gray-500 hover:text-black"
                    aria-label={`Eliminar color ${colorName}`}
                  >
                    ×
                  </button>
                </div>
              ) : null;
            })}
          </div>
        </div>
      )}
    </div>
  );
});

ColorPicker.displayName = 'ColorPicker';