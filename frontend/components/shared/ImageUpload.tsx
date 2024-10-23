import { ImagePlus, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useCallback, useState } from 'react';
import { Button } from '../ui/button';

export interface ImageUploadProps {
    value: string[];
    onChange: (urls: string[]) => void;
    maxImages?: number;
    disabled?: boolean;
  }

export const ImageUpload = ({
    value = [],
    onChange,
    maxImages = 4
}: ImageUploadProps) => {
    const [isUploading, setIsUploading] = useState(false);

    const handleImageUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length) return;

        setIsUploading(true);
        try {
            // Por ahora usamos URLs de placeholder
            // TODO: Implementar carga real de imágenes
            const newImages = Array.from(e.target.files).map((_, index) =>
                `/api/placeholder/${400}/${500}?text=Product${value.length + index + 1}`
            );

            onChange([...value, ...newImages].slice(0, maxImages));
        } catch (error) {
            console.error('Error uploading image:', error);
        } finally {
            setIsUploading(false);
        }
    }, [value, onChange, maxImages]);

    const removeImage = useCallback((index: number) => {
        onChange(value.filter((_, i) => i !== index));
    }, [value, onChange]);

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                {value.map((url, index) => (
                    <div key={url} className="relative group aspect-square">
                        <Image
                            src={url}
                            alt={`Product image ${index + 1}`}
                            layout="fill"
                            objectFit="cover"
                            className="rounded-lg"
                        />
                        <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removeImage(index)}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                ))}
            </div>

            {value.length < maxImages && (
                <div className="flex items-center justify-center w-full">
                    <label className="w-full cursor-pointer">
                        <Button
                            type="button"
                            variant="outline"
                            className="w-full"
                            disabled={isUploading}
                        >
                            <ImagePlus className="h-4 w-4 mr-2" />
                            {isUploading ? 'Subiendo...' : 'Agregar imagen'}
                        </Button>
                        <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            multiple
                            onChange={handleImageUpload}
                            disabled={isUploading}
                        />
                    </label>
                </div>
            )}
        </div>
    );
};