import { cn } from '@/lib/utils';
import { UploadService } from '@/services/uploadService';
import { ImagePlus, Trash2, UploadCloud } from 'lucide-react';
import Image from 'next/image';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';

interface ImageUploadProps {
    value: string[];
    onChange: (urls: string[]) => void;
    maxImages?: number;
    disabled?: boolean;
    category?: string;
}

export const ImageUpload = ({
    value = [],
    onChange,
    maxImages = 4,
    disabled = false,
    category = 'products',
}: ImageUploadProps) => {
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    const handleUpload = useCallback(
        async (files: File[]) => {
            if (disabled) return;
            if (value.length + files.length > maxImages) {
                toast.error(`Máximo ${maxImages} imágenes permitidas`);
                return;
            }

            setIsUploading(true);
            setUploadProgress(0);

            try {
                const uploadPromises = files.map(async (file, index) => {
                    try {
                        const path = await UploadService.uploadImage(file, category);
                        const progress = ((index + 1) / files.length) * 100;
                        setUploadProgress(progress);
                        return path;
                    } catch (error) {
                        console.error(`Error uploading file ${index}:`, error);
                        throw error;
                    }
                });

                const newPaths = await Promise.all(uploadPromises);
                onChange([...value, ...newPaths]);
                toast.success('Imágenes subidas exitosamente');
            } catch (error) {
                toast.error('Error al subir las imágenes');
                console.error('Upload error:', error);
            } finally {
                setIsUploading(false);
                setUploadProgress(0);
            }
        },
        [value, onChange, maxImages, disabled, category]
    );

    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            handleUpload(acceptedFiles);
        },
        [handleUpload]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.png', '.jpg', '.jpeg', '.webp'],
        },
        disabled: isUploading || disabled || value.length >= maxImages,
        maxFiles: maxImages - value.length,
    });

    const removeImage = useCallback(
        (index: number) => {
            onChange(value.filter((_, i) => i !== index));
        },
        [value, onChange]
    );

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                {value.map((url, index) => (
                    <div key={url} className="relative group aspect-square">
                        <Image
                            src={UploadService.getImageUrl(url)}
                            alt={`Product image ${index + 1}`}
                            className="rounded-lg object-cover"
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                            <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                onClick={() => removeImage(index)}
                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            {value.length < maxImages && (
                <div
                    {...getRootProps()}
                    className={cn(
                        'border-2 border-dashed rounded-lg p-6 hover:border-gray-400 transition-colors cursor-pointer',
                        isDragActive && 'border-blue-500 bg-blue-50',
                        disabled && 'opacity-50 cursor-not-allowed'
                    )}
                >
                    <input {...getInputProps()} />
                    <div className="flex flex-col items-center justify-center space-y-2 text-center">
                        {isUploading ? (
                            <>
                                <UploadCloud className="h-10 w-10 text-gray-400 animate-bounce" />
                                <p className="text-sm text-gray-600">Subiendo imágenes...</p>
                                <Progress value={uploadProgress} className="w-full max-w-xs" />
                            </>
                        ) : (
                            <>
                                <ImagePlus className="h-10 w-10 text-gray-400" />
                                <div className="text-sm text-gray-600">
                                    <p>Arrastra tus imágenes aquí o</p>
                                    <p className="font-medium text-blue-600">haz clic para seleccionar</p>
                                </div>
                                <p className="text-xs text-gray-400">
                                    PNG, JPG o WEBP (máx. {maxImages} imágenes)
                                </p>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
