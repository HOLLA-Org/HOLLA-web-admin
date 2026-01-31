'use client';

import React from 'react';
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
import { useCreateAmenity } from '@/hooks/use-amenities';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

import { useTranslation } from 'react-i18next';

const getAmenitySchema = (t: any) => z.object({
    name: z.string().min(2, t('validation.name_min')),
    icon: z.string().optional(),
});

type AmenityFormValues = z.infer<ReturnType<typeof getAmenitySchema>>;

interface AmenityDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initialName?: string;
    onSuccess?: (id: string) => void;
}

export function AmenityDialog({ open, onOpenChange, initialName = '', onSuccess }: AmenityDialogProps) {
    const { t } = useTranslation('hotel');
    const createAmenity = useCreateAmenity();

    const form = useForm<AmenityFormValues>({
        resolver: zodResolver(getAmenitySchema(t)),
        defaultValues: {
            name: initialName,
            icon: '',
        },
    });

    React.useEffect(() => {
        if (open) {
            form.reset({
                name: initialName,
                icon: '',
            });
        }
    }, [open, initialName, form]);

    const onSubmit = async (values: AmenityFormValues) => {
        try {
            const result = await createAmenity.mutateAsync(values);
            if (result.ok) {
                toast.success(t('amenity_dialog.messages.success'));
                if (result.data?._id && onSuccess) {
                    onSuccess(result.data._id);
                }
                onOpenChange(false);
            } else {
                toast.error(result.message || t('amenity_dialog.messages.error'));
            }
        } catch (error) {
            toast.error(t('amenity_dialog.messages.generic_error'));
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{t('amenity_dialog.title')}</DialogTitle>
                    <DialogDescription>
                        {t('amenity_dialog.description')}
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('amenity_dialog.form.name')}</FormLabel>
                                    <FormControl>
                                        <Input placeholder={t('amenity_dialog.form.name_placeholder')} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="icon"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('amenity_dialog.form.icon')}</FormLabel>
                                    <FormControl>
                                        <Input placeholder={t('amenity_dialog.form.icon_placeholder')} {...field} />
                                    </FormControl>
                                    <FormDescription className="text-[10px]">
                                        {t('amenity_dialog.form.icon_desc')}
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter className="pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                                disabled={createAmenity.isPending}
                            >
                                {t('amenity_dialog.form.cancel')}
                            </Button>
                            <Button type="submit" disabled={createAmenity.isPending} className="bg-[#238C98] hover:bg-[#1d7681]">
                                {createAmenity.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {t('amenity_dialog.form.create')}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
