'use client';

import React, { useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useHotels, useDeleteHotel } from '@/hooks/use-hotels';
import { Edit2, Trash2, Plus, ChevronRight, ChevronLeft, ImageIcon } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { HotelDialog } from './hotel-dialog';
import { AddHotelImagesDialog } from './add-images-dialog';
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
import { Hotel } from '@/types/api/response/hotel.response';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';

export function HotelTable() {
    const { t } = useTranslation('hotel');
    const { data: response, isLoading, isError } = useHotels();
    const [page, setPage] = useState(1);
    const limit = 10;
    const deleteHotel = useDeleteHotel();
    const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isAddImagesDialogOpen, setIsAddImagesDialogOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'all' | 'popular'>('all');

    const [hotelToDelete, setHotelToDelete] = useState<string | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const handleDeleteClick = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setHotelToDelete(id);
        setIsDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        if (!hotelToDelete) return;

        const result = await deleteHotel.mutateAsync(hotelToDelete);
        if (result.ok) {
            toast.success(t('messages.delete_success'));
        } else {
            toast.error(result.message || t('messages.delete_error'));
        }
        setIsDeleteDialogOpen(false);
        setHotelToDelete(null);
    };

    const handleEdit = (hotel: Hotel, e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedHotel(hotel);
        setIsDialogOpen(true);
    };

    const handleOpenAddDialog = () => {
        setSelectedHotel(null);
        setIsDialogOpen(true);
    };

    const allHotels = (response?.data || []).filter(h => {
        if (activeTab === 'popular') return h.isPopular;
        return true;
    });

    const totalItems = allHotels.length;
    const totalPages = Math.ceil(totalItems / limit);
    const paginatedHotels = allHotels.slice((page - 1) * limit, page * limit);

    return (
        <div className="w-full bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 pb-4">
            <div className="p-6 pb-0">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-slate-800">{t('title')}</h2>
                    <div className="flex items-center gap-2">
                        <Button onClick={() => setIsAddImagesDialogOpen(true)} className="bg-[#238C98] hover:bg-[#1d7681] text-white rounded-xl gap-2 h-10 px-4">
                            <ImageIcon className="w-4 h-4" />
                            {t('add_images')}
                        </Button>
                        <Button onClick={handleOpenAddDialog} className="bg-[#238C98] hover:bg-[#1d7681] text-white rounded-xl gap-2 h-10 px-4">
                            <Plus className="w-4 h-4" />
                            {t('add_hotel')}
                        </Button>
                    </div>
                </div>

                <div className="flex gap-6 mb-4 border-b border-gray-50 pb-2">
                    <button
                        onClick={() => setActiveTab('all')}
                        className={cn(
                            "text-sm font-bold pb-2 transition-colors relative",
                            activeTab === 'all' ? "text-[#238C98]" : "text-gray-300"
                        )}
                    >
                        {t('tabs.all')}
                        {activeTab === 'all' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#238C98] rounded-full" />}
                    </button>
                    <button
                        onClick={() => setActiveTab('popular')}
                        className={cn(
                            "text-sm font-bold pb-2 transition-colors relative",
                            activeTab === 'popular' ? "text-[#238C98]" : "text-gray-300"
                        )}
                    >
                        {t('tabs.popular')}
                        {activeTab === 'popular' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#238C98] rounded-full" />}
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto px-2">
                <Table className="min-w-full">
                    <TableHeader>
                        <TableRow className="border-0 hover:bg-transparent h-14">
                            <TableHead className="font-bold text-gray-400 text-[11px] uppercase tracking-wider text-center w-[60px]">{t('table.stt')}</TableHead>
                            <TableHead className="font-bold text-gray-400 text-[11px] uppercase tracking-wider text-center">{t('table.hotel')}</TableHead>
                            <TableHead className="font-bold text-gray-400 text-[11px] uppercase tracking-wider text-center">{t('table.image')}</TableHead>
                            <TableHead className="font-bold text-gray-400 text-[11px] uppercase tracking-wider text-center">{t('table.address')}</TableHead>
                            <TableHead className="font-bold text-gray-400 text-[11px] uppercase tracking-wider text-center">{t('table.price_hour')}</TableHead>
                            <TableHead className="font-bold text-gray-400 text-[11px] uppercase tracking-wider text-center">{t('table.price_day')}</TableHead>
                            <TableHead className="font-bold text-gray-400 text-[11px] uppercase tracking-wider text-center">{t('table.status')}</TableHead>
                            <TableHead className="font-bold text-gray-400 text-[11px] uppercase tracking-wider text-center w-[120px]">{t('table.action')}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            [...Array(5)].map((_, index) => (
                                <TableRow key={index} className="h-20 border-0">
                                    <TableCell className="text-center"><Skeleton className="h-4 w-8 mx-auto" /></TableCell>
                                    <TableCell className="text-center"><Skeleton className="h-4 w-32 mx-auto" /></TableCell>
                                    <TableCell className="text-center">
                                        <div className="flex justify-center">
                                            <Skeleton className="h-12 w-12 rounded-xl" />
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center"><Skeleton className="h-4 w-40 mx-auto" /></TableCell>
                                    <TableCell className="text-center"><Skeleton className="h-4 w-20 mx-auto" /></TableCell>
                                    <TableCell className="text-center"><Skeleton className="h-4 w-20 mx-auto" /></TableCell>
                                    <TableCell className="text-center">
                                        <div className="flex justify-center">
                                            <Skeleton className="h-6 w-24 rounded-full" />
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <div className="flex justify-center gap-2">
                                            <Skeleton className="h-8 w-8 rounded-lg" />
                                            <Skeleton className="h-8 w-8 rounded-lg" />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : isError || (response && !response.ok) ? (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center py-20 text-red-500 italic">
                                    {t('messages.load_error')}
                                </TableCell>
                            </TableRow>
                        ) : paginatedHotels.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center py-12 text-gray-400 italic">
                                    {t('table.no_data')}
                                </TableCell>
                            </TableRow>
                        ) : (
                            paginatedHotels.map((hotel, index) => (
                                <TableRow key={hotel._id} className="border-0 hover:bg-slate-50/50 transition-colors h-20 group">
                                    <TableCell className="text-center text-[13px] text-slate-600 font-bold">
                                        {(page - 1) * limit + index + 1}
                                    </TableCell>
                                    <TableCell className="text-center font-bold text-slate-700 text-[13px]">
                                        {hotel.name}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="relative h-12 w-12 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                                                {hotel.images && hotel.images[0] ? (
                                                    <Image
                                                        src={hotel.images[0]}
                                                        alt={hotel.name}
                                                        fill
                                                        className="object-cover"
                                                        unoptimized
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <ImageIcon className="w-5 h-5 text-slate-300" />
                                                    </div>
                                                )}
                                            </div>
                                            {hotel.images && hotel.images.length > 1 && (
                                                <span className="text-slate-400 text-[12px] font-bold min-w-[16px] flex items-center h-12">
                                                    +{hotel.images.length - 1}
                                                </span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center max-w-[200px]">
                                        <span className="text-[12px] text-slate-500 line-clamp-1 mx-auto">{hotel.address}</span>
                                    </TableCell>
                                    <TableCell className="text-center text-[13px] font-bold text-slate-700">
                                        {(hotel.priceHour || 0).toLocaleString()} VNĐ
                                    </TableCell>
                                    <TableCell className="text-center text-[13px] font-bold text-slate-700">
                                        {(hotel.priceDay || 0).toLocaleString()} VNĐ
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <div className="flex justify-center">
                                            <span className={cn(
                                                "inline-flex items-center justify-center rounded-full min-w-[100px] px-4 py-2 text-[10px] font-bold text-white uppercase shadow-sm whitespace-nowrap",
                                                hotel.availableRooms > 0 ? "bg-[#05CD99]" : "bg-red-400"
                                            )}>
                                                {hotel.availableRooms > 0 ? t('status_label.available') : t('status_label.out_of_stock')}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <div className="flex items-center justify-center gap-1 transition-all duration-200">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-slate-400 hover:text-[#238C98] hover:bg-[#238C98]/10 rounded-lg"
                                                onClick={(e) => handleEdit(hotel, e)}
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
                                                onClick={(e) => handleDeleteClick(hotel._id, e)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="px-6 py-4 flex items-center justify-between mt-2">
                <p className="text-xs text-slate-400">
                    {t('pagination.page')} <span className="text-slate-700 font-bold ml-1">{page}</span> {t('pagination.of')} {totalPages || 1}
                </p>
                <div className="flex items-center gap-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-lg text-gray-400 hover:text-[#238C98] hover:bg-[#238C98]/10 disabled:opacity-50"
                        disabled={page === 1}
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button className="h-8 w-8 rounded-lg bg-[#238C98] text-white text-xs font-bold shadow-sm cursor-default">
                        {page}
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-lg text-gray-400 hover:text-[#238C98] hover:bg-[#238C98]/10 disabled:opacity-50"
                        disabled={page >= totalPages}
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>

                </div>
            </div>

            <HotelDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                hotel={selectedHotel}
            />
            <AddHotelImagesDialog
                open={isAddImagesDialogOpen}
                onOpenChange={setIsAddImagesDialogOpen}
            />

            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{t('messages.delete_confirm_title', 'Delete Hotel')}</AlertDialogTitle>
                        <AlertDialogDescription>
                            {t('messages.delete_confirm_description', 'Are you sure you want to delete this hotel? This action cannot be undone.')}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>{t('common.cancel', 'Cancel')}</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDelete}
                            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                        >
                            {t('common.delete', 'Delete')}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div >
    );
}
