import { Check } from 'lucide-react';

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
  disabled: boolean;
}

export const ColorPicker = ({ selected = [], onChange }: ColorPickerProps) => {
  const toggleColor = (colorName: string) => {
    const newSelected = selected.includes(colorName)
      ? selected.filter(c => c !== colorName)
      : [...selected, colorName];
    onChange(newSelected);
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">Colores disponibles</label>
      <div className="grid grid-cols-5 gap-2">
        {COLORS.map(({ name, value }) => (
          <button
            key={name}
            type="button"
            onClick={() => toggleColor(name)}
            className={`
              w-full aspect-square rounded-full p-1 relative
              ${selected.includes(name) ? 'ring-2 ring-offset-2 ring-blue-500' : ''}
            `}
            style={{ backgroundColor: value }}
          >
            {selected.includes(name) && (
              <Check 
                className={`w-4 h-4 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                  ${value === '#FFFFFF' ? 'text-black' : 'text-white'}`}
              />
            )}
            <span className="sr-only">{name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};