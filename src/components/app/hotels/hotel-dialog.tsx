'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Hotel } from '@/types/api/response/hotel.response';
import { useCreateHotel, useUpdateHotel } from '@/hooks/use-hotels';
import { toast } from 'sonner';
import { Check, ChevronsUpDown, Loader2, Search, PlusCircle, Trash2 } from 'lucide-react';
import { useAmenities, useDeleteAmenity } from '@/hooks/use-amenities';
import { AmenityDialog } from './amenity-dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { MapLocationPicker } from '@/components/custom/map-location-picker';
import { useTranslation } from 'react-i18next';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const getHotelSchema = (t: any) => z.object({
    name: z.string().min(2, t('validation.name_min')),
    address: z.string().min(5, t('validation.address_min')),
    latitude: z.coerce.number(),
    longitude: z.coerce.number(),
    priceHour: z.coerce.number().min(0, t('validation.positive_price')),
    priceDay: z.coerce.number().min(0, t('validation.positive_price')),
    totalRooms: z.coerce.number().min(0, t('validation.positive_rooms')),
    availableRooms: z.coerce.number().min(0, t('validation.positive_rooms')),
    isPopular: z.boolean(),
    rating: z.coerce.number().min(0).max(5),
    ratingCount: z.coerce.number().min(0),
    amenities: z.array(z.string()),
});

type HotelFormValues = z.infer<ReturnType<typeof getHotelSchema>>;

interface HotelDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    hotel?: Hotel | null;
}

export function HotelDialog({ open, onOpenChange, hotel }: HotelDialogProps) {
    const { t } = useTranslation('hotel');
    const isEditing = !!hotel;
    const createHotel = useCreateHotel();
    const updateHotel = useUpdateHotel();

    const form = useForm<HotelFormValues>({
        resolver: zodResolver(getHotelSchema(t)),
        defaultValues: {
            name: '',
            address: '',
            latitude: 0,
            longitude: 0,
            priceHour: 0,
            priceDay: 0,
            totalRooms: 0,
            availableRooms: 0,
            isPopular: false,
            rating: 0,
            ratingCount: 0,
            amenities: [],
        },
    });

    useEffect(() => {
        if (open) {
            if (hotel) {
                form.reset({
                    name: hotel.name || '',
                    address: hotel.address || '',
                    latitude: hotel.latitude || 0,
                    longitude: hotel.longitude || 0,
                    priceHour: hotel.priceHour || 0,
                    priceDay: hotel.priceDay || 0,
                    totalRooms: hotel.totalRooms || 0,
                    availableRooms: hotel.availableRooms || 0,
                    isPopular: hotel.isPopular === true || String(hotel.isPopular) === 'true',
                    rating: hotel.rating || 0,
                    ratingCount: hotel.ratingCount || 0,
                    amenities: hotel.amenities?.map((a: any) => typeof a === 'string' ? a : a._id) || [],
                });
            } else {
                form.reset({
                    name: '',
                    address: '',
                    latitude: 0,
                    longitude: 0,
                    priceHour: 0,
                    priceDay: 0,
                    totalRooms: 0,
                    availableRooms: 0,
                    isPopular: false,
                    rating: 0,
                    ratingCount: 0,
                    amenities: [],
                });
            }
        }
    }, [open, hotel, form]);

    const onSubmit = async (values: HotelFormValues) => {
        try {
            if (isEditing && hotel) {
                const result = await updateHotel.mutateAsync({
                    id: hotel._id,
                    ...values,
                });
                if (result.ok) {
                    toast.success(t('messages.update_success'));
                    onOpenChange(false);
                } else {
                    toast.error(result.message || t('messages.update_error'));
                }
            } else {
                const result = await createHotel.mutateAsync(values);
                if (result.ok) {
                    toast.success(t('messages.create_success'));
                    onOpenChange(false);
                } else {
                    toast.error(result.message || t('messages.create_error'));
                }
            }
        } catch (error) {
            toast.error(t('messages.generic_error'));
        }
    };

    const isLoading = createHotel.isPending || updateHotel.isPending;
    const { data: amenitiesData, isLoading: isLoadingAmenities } = useAmenities();
    const [searchTerm, setSearchTerm] = React.useState('');
    const [amenityDialogOpen, setAmenityDialogOpen] = React.useState(false);

    const filteredAmenities = React.useMemo(() => {
        if (!amenitiesData?.data) return [];
        return amenitiesData.data.filter((amenity) =>
            amenity.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [amenitiesData, searchTerm]);

    const deleteAmenity = useDeleteAmenity();

    // State for amenity delete dialog
    const [amenityToDelete, setAmenityToDelete] = React.useState<{ id: string, name: string } | null>(null);
    const [isDeleteAmenityDialogOpen, setIsDeleteAmenityDialogOpen] = React.useState(false);

    const handleDeleteAmenityClick = (e: React.MouseEvent, id: string, name: string) => {
        e.stopPropagation();
        setAmenityToDelete({ id, name });
        setIsDeleteAmenityDialogOpen(true);
    };

    const confirmDeleteAmenity = async () => {
        if (!amenityToDelete) return;

        const result = await deleteAmenity.mutateAsync(amenityToDelete.id);
        if (result.ok) {
            toast.success(t('amenity_dialog.messages.delete_success'));

            // If the deleted amenity was selected, remove it from selection
            const current = form.getValues('amenities') || [];
            if (current.includes(amenityToDelete.id)) {
                form.setValue('amenities', current.filter(amenityId => amenityId !== amenityToDelete.id));
            }
        } else {
            toast.error(result.message || t('amenity_dialog.messages.delete_error'));
        }
        setIsDeleteAmenityDialogOpen(false);
        setAmenityToDelete(null);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{isEditing ? t('dialog.edit_title') : t('dialog.add_title')}</DialogTitle>
                    <DialogDescription>
                        {isEditing
                            ? t('dialog.edit_desc')
                            : t('dialog.add_desc')}
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('form.name')}</FormLabel>
                                    <FormControl>
                                        <Input placeholder={t('form.placeholders.name')} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('form.address')}</FormLabel>
                                    <FormControl>
                                        <MapLocationPicker
                                            value={field.value}
                                            lat={form.getValues('latitude')}
                                            lng={form.getValues('longitude')}
                                            onChange={({ address, lat, lng }) => {
                                                form.setValue('address', address, { shouldValidate: true });
                                                form.setValue('latitude', lat);
                                                form.setValue('longitude', lng);
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="priceHour"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('form.price_hour')} (vnđ)</FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="priceDay"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('form.price_day')} (vnđ)</FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="totalRooms"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('form.total_rooms')}</FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="availableRooms"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('form.available_rooms')}</FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>



                        <FormField
                            control={form.control}
                            name="isPopular"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                    <div className="space-y-0.5">
                                        <FormLabel className="text-sm font-semibold">{t('form.popular')}</FormLabel>
                                        <FormDescription className="text-xs">
                                            {t('form.popular_desc')}
                                        </FormDescription>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            checked={!!field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="amenities"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>{t('form.amenities')}</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    className={cn(
                                                        "w-full justify-between h-auto min-h-10 py-2",
                                                        !field.value?.length && "text-muted-foreground"
                                                    )}
                                                >
                                                    <div className="flex flex-wrap gap-1">
                                                        {field.value?.length > 0 ? (
                                                            amenitiesData?.data
                                                                ?.filter((a) => field.value.includes(a._id))
                                                                .map((a) => (
                                                                    <Badge
                                                                        key={a._id}
                                                                        variant="secondary"
                                                                        className="font-normal"
                                                                    >
                                                                        {a.name}
                                                                    </Badge>
                                                                ))
                                                        ) : (
                                                            t('form.select_amenities')
                                                        )}
                                                    </div>
                                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                                            <div className="flex items-center border-b px-3">
                                                <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                                                <input
                                                    className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                                                    placeholder={t('form.search_amenities')}
                                                    value={searchTerm}
                                                    onChange={(e) => setSearchTerm(e.target.value)}
                                                />
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 ml-1 text-[#238C98] hover:text-[#1d7681] hover:bg-transparent"
                                                    onClick={() => setAmenityDialogOpen(true)}
                                                >
                                                    <PlusCircle className="h-5 w-5" />
                                                </Button>
                                            </div>
                                            <div className="max-h-60 overflow-y-auto p-2">
                                                {isLoadingAmenities ? (
                                                    <div className="flex items-center justify-center py-6">
                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                    </div>
                                                ) : filteredAmenities.length === 0 ? (
                                                    <p className="py-6 text-center text-sm">{t('form.no_amenities')}</p>
                                                ) : (
                                                    <div className="space-y-1">
                                                        {filteredAmenities.map((amenity) => (
                                                            <div
                                                                key={amenity._id}
                                                                className="flex items-center space-x-2 rounded-sm px-2 py-1.5 hover:bg-accent cursor-pointer"
                                                                onClick={() => {
                                                                    const current = field.value || [];
                                                                    const next = current.includes(amenity._id)
                                                                        ? current.filter((id) => id !== amenity._id)
                                                                        : [...current, amenity._id];
                                                                    field.onChange(next);
                                                                }}
                                                            >
                                                                <Checkbox
                                                                    className="data-[state=checked]:bg-[#238C98] data-[state=checked]:border-[#238C98]"
                                                                    checked={field.value?.includes(amenity._id)}
                                                                    onCheckedChange={() => {
                                                                        // handled by onClick on parent div
                                                                    }}
                                                                />
                                                                <span className="text-sm flex-1">{amenity.name}</span>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="h-6 w-6 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full"
                                                                    onClick={(e) => handleDeleteAmenityClick(e, amenity._id, amenity.name)}
                                                                >
                                                                    <Trash2 className="w-3.5 h-3.5" />
                                                                </Button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter className="pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                                disabled={isLoading}
                            >
                                {t('form.cancel')}
                            </Button>
                            <Button type="submit" disabled={isLoading} className="bg-[#238C98] hover:bg-[#1d7681]">
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {isEditing ? t('form.save') : t('form.create')}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
            <AmenityDialog
                open={amenityDialogOpen}
                onOpenChange={setAmenityDialogOpen}
                initialName={searchTerm}
                onSuccess={(newId) => {
                    const current = form.getValues('amenities') || [];
                    if (!current.includes(newId)) {
                        form.setValue('amenities', [...current, newId]);
                    }
                    setSearchTerm('');
                }}
            />

            <AlertDialog open={isDeleteAmenityDialogOpen} onOpenChange={setIsDeleteAmenityDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{t('amenity_dialog.delete_confirm_title')}</AlertDialogTitle>
                        <AlertDialogDescription>
                            {amenityToDelete && t('amenity_dialog.delete_confirm_desc', { name: amenityToDelete.name })}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDeleteAmenity}
                            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                        >
                            {t('common.delete')}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </Dialog>
    );
}
