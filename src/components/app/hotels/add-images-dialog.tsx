'use client';

import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useHotels, useUploadHotelImages } from '@/hooks/use-hotels';
// import { mediaService } from '@/services/media-service';
import { toast } from 'sonner';
import { Loader2, Upload, X, PlusCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface AddHotelImagesDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function AddHotelImagesDialog({ open, onOpenChange }: AddHotelImagesDialogProps) {
    const { t } = useTranslation('hotel');
    const { data: hotelsData } = useHotels();
    const uploadImagesMutation = useUploadHotelImages();

    const [selectedHotelId, setSelectedHotelId] = useState<string>('');
    const [files, setFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        // Create object URLs for previews
        const newPreviews = files.map(file => URL.createObjectURL(file));
        setPreviews(newPreviews);

        // Cleanup function to revoke URLs
        return () => {
            newPreviews.forEach(url => URL.revokeObjectURL(url));
        };
    }, [files]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFiles(prev => [...prev, ...Array.from(e.target.files!)]);
        }
    };

    const removeFile = (index: number) => {
        setFiles(files.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        if (!selectedHotelId) {
            toast.error(t('Please select a hotel')); // Fallback text if generic key missing
            return;
        }
        if (files.length === 0) {
            toast.error(t('Please select at least one image'));
            return;
        }

        setIsUploading(true);
        try {
            const formData = new FormData();
            files.forEach(file => {
                formData.append('images', file);
            });

            // Upload images directly to hotel endpoint
            const result = await uploadImagesMutation.mutateAsync({
                id: selectedHotelId,
                formData
            });

            if (result.ok) {
                toast.success(t('Images added successfully'));
                setFiles([]);
                setSelectedHotelId('');
                onOpenChange(false);
            } else {
                toast.error(result.message || t('Failed to add images'));
            }
        } catch (error) {
            console.error(error);
            toast.error(t('An error occurred'));
        } finally {
            setIsUploading(false);
        }
    };

    const hotels = hotelsData?.data || [];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{t('Add Images')}</DialogTitle>
                    <DialogDescription>
                        {t('Select a hotel and upload images')}
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label>{t('Hotel')}</Label>
                        <Select value={selectedHotelId} onValueChange={setSelectedHotelId}>
                            <SelectTrigger>
                                <SelectValue placeholder={t('Select a hotel')} />
                            </SelectTrigger>
                            <SelectContent>
                                {hotels.map((hotel) => (
                                    <SelectItem key={hotel._id} value={hotel._id}>
                                        {hotel.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid gap-2">
                        <Label>{t('Images')}</Label>
                        <div className="grid grid-cols-4 gap-2">
                            {files.map((file, index) => (
                                <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-slate-200 group">
                                    <img
                                        src={previews[index]}
                                        alt="preview"
                                        className="w-full h-full object-cover"
                                    />
                                    <button
                                        onClick={() => removeFile(index)}
                                        className="absolute top-1 right-1 bg-black/50 hover:bg-black/70 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                            ))}

                            <div className="aspect-square border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors relative">
                                <Input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    className="absolute inset-0 opacity-0 cursor-pointer h-full w-full z-10"
                                    onChange={handleFileChange}
                                    value=""
                                />
                                <PlusCircle className="w-10 h-10 text-slate-300" />
                            </div>
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isUploading}>
                        {t('Cancel')}
                    </Button>
                    <Button onClick={handleSubmit} disabled={isUploading || !selectedHotelId || files.length === 0} className="bg-[#238C98] hover:bg-[#1d7681]">
                        {isUploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {t('Upload')}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
