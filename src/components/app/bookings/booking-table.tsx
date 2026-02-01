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
import { useBookings, useConfirmBooking, useAdminCancelBooking, useAdminCheckOutBooking } from '@/hooks/use-bookings';
import { Check, X, LogOut, Eye, CalendarCheck, XCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { Booking, BookingStatus } from '@/types/api/response/booking.response';
import { cn } from '@/lib/utils';
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
import { User } from '@/types/entities/user.entity';
import { Hotel } from '@/types/api/response/hotel.response';
import { useTranslation } from 'react-i18next';

export function BookingTable() {
    const { t } = useTranslation('booking');
    const { data: response, isLoading, isError } = useBookings();
    const confirmBooking = useConfirmBooking();
    const cancelBooking = useAdminCancelBooking();
    const checkOutBooking = useAdminCheckOutBooking();

    const [page, setPage] = useState(1);
    const limit = 10;
    const [activeTab, setActiveTab] = useState<BookingStatus | 'all'>('pending');

    const [actionBooking, setActionBooking] = useState<{ id: string, type: 'confirm' | 'cancel' | 'checkout' } | null>(null);

    const handleAction = async () => {
        if (!actionBooking) return;

        try {
            let result;
            if (actionBooking.type === 'confirm') {
                result = await confirmBooking.mutateAsync(actionBooking.id);
            } else if (actionBooking.type === 'cancel') {
                result = await cancelBooking.mutateAsync(actionBooking.id);
            } else if (actionBooking.type === 'checkout') {
                result = await checkOutBooking.mutateAsync(actionBooking.id);
            }

            if (result?.ok) {
                toast.success(t('messages.action_success'));
            } else {
                toast.error(result?.message || t('messages.action_fail'));
            }
        } catch (error) {
            toast.error(t('messages.error_occurred'));
        } finally {
            setActionBooking(null);
        }
    };

    const allBookings = response?.data || [];

    // Filter bookings based on activeTab
    const filteredBookings = allBookings.filter(b => {
        if (activeTab === 'all') return true;
        return b.status === activeTab;
    });

    const totalItems = filteredBookings.length;
    const totalPages = Math.ceil(totalItems / limit);
    const paginatedBookings = filteredBookings.slice((page - 1) * limit, page * limit);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getStatusColor = (status: BookingStatus) => {
        switch (status) {
            case 'pending': return 'bg-[#E539358C]';
            case 'active': return 'bg-[#FCB044]';
            case 'completed': return 'bg-[#00BFA6]';
            case 'cancelled': return 'bg-[#E539358C]';
            default: return 'bg-gray-500';
        }
    };

    return (
        <div className="w-full bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 pb-4">
            <div className="p-6 pb-0">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-slate-800">{t('title')}</h2>
                </div>

                <div className="flex gap-6 mb-4 border-b border-gray-50 pb-2 overflow-x-auto">
                    {(['pending', 'active', 'completed', 'cancelled'] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => {
                                setActiveTab(tab);
                                setPage(1);
                            }}
                            className={cn(
                                "text-sm font-bold pb-2 transition-colors relative capitalize whitespace-nowrap",
                                activeTab === tab ? "text-[#238C98]" : "text-gray-300"
                            )}
                        >
                            {t(`tabs.${tab}`)}
                            {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#238C98] rounded-full" />}
                        </button>
                    ))}
                </div>
            </div>

            <div className="overflow-x-auto px-2">
                <Table className="min-w-full">
                    <TableHeader>
                        <TableRow className="border-0 hover:bg-transparent h-14">
                            <TableHead className="font-bold text-slate-400 text-[11px] uppercase tracking-wider text-center w-[60px]">{t('table.stt')}</TableHead>
                            <TableHead className="font-bold text-slate-400 text-[11px] uppercase tracking-wider text-center">{t('table.customer')}</TableHead>
                            <TableHead className="font-bold text-slate-400 text-[11px] uppercase tracking-wider text-center">{t('table.hotel')}</TableHead>
                            <TableHead className="font-bold text-slate-400 text-[11px] uppercase tracking-wider text-center">{t('table.check_in')}</TableHead>
                            <TableHead className="font-bold text-slate-400 text-[11px] uppercase tracking-wider text-center">{t('table.check_out')}</TableHead>
                            <TableHead className="font-bold text-slate-400 text-[11px] uppercase tracking-wider text-center">{t('table.type')}</TableHead>
                            <TableHead className="font-bold text-slate-400 text-[11px] uppercase tracking-wider text-center">{t('table.price')}</TableHead>
                            <TableHead className="font-bold text-slate-400 text-[11px] uppercase tracking-wider text-center">{t('table.status')}</TableHead>
                            {['pending', 'active'].includes(activeTab) && (
                                <TableHead className="font-bold text-slate-400 text-[11px] uppercase tracking-wider text-center w-[150px]">{t('table.action')}</TableHead>
                            )}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            [...Array(5)].map((_, index) => (
                                <TableRow key={index} className="h-20 border-0">
                                    <TableCell colSpan={['pending', 'active'].includes(activeTab) ? 9 : 8} className="text-center"><Skeleton className="h-4 w-full mx-auto" /></TableCell>
                                </TableRow>
                            ))
                        ) : isError ? (
                            <TableRow>
                                <TableCell colSpan={['pending', 'active'].includes(activeTab) ? 9 : 8} className="text-center py-20 text-red-500 italic">
                                    {t('messages.load_error')}
                                </TableCell>
                            </TableRow>
                        ) : paginatedBookings.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={['pending', 'active'].includes(activeTab) ? 9 : 8} className="text-center py-12 text-slate-400 italic">
                                    {t('messages.no_data')}
                                </TableCell>
                            </TableRow>
                        ) : (
                            paginatedBookings.map((booking, index) => {
                                const user = booking.user_id as unknown as { username: string, email: string };
                                const hotel = booking.hotel_id as unknown as { name: string, address: string };

                                return (
                                    <TableRow key={booking._id} className="border-0 hover:bg-slate-50/50 transition-colors h-20">
                                        <TableCell className="text-center text-[13px] text-slate-600 font-bold">
                                            {(page - 1) * limit + index + 1}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <span className="text-[13px] font-bold text-slate-700">{user?.username || 'Unknown User'}</span>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <span className="text-[13px] font-bold text-slate-700 block line-clamp-1 max-w-[200px] mx-auto" title={hotel?.name}>{hotel?.name || 'Unknown Hotel'}</span>
                                        </TableCell>
                                        <TableCell className="text-center text-[12px] text-slate-600 font-medium">
                                            {formatDate(booking.check_in)}
                                        </TableCell>
                                        <TableCell className="text-center text-[12px] text-slate-600 font-medium">
                                            {formatDate(booking.check_out)}
                                        </TableCell>
                                        <TableCell className="text-center text-[12px] capitalize text-slate-600">
                                            {t(`type.${booking.booking_type}`)}
                                        </TableCell>
                                        <TableCell className="text-center text-[13px] font-bold text-slate-700">
                                            {booking.total_price?.toLocaleString()} VNĐ
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <span className={cn(
                                                "inline-flex items-center justify-center rounded-full px-4 py-1.5 text-xs font-bold text-white shadow-sm",
                                                getStatusColor(booking.status)
                                            )}>
                                                {t(`status.${booking.status}`)}
                                            </span>
                                        </TableCell>
                                        {['pending', 'active'].includes(activeTab) && (
                                            <TableCell className="text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    {booking.status === 'pending' && (
                                                        <Button
                                                            size="sm"
                                                            className="h-8 bg-[#05CD99] hover:bg-[#04b688] text-white rounded-lg px-3 text-[11px] font-bold shadow-sm"
                                                            onClick={() => setActionBooking({ id: booking._id, type: 'confirm' })}
                                                        >
                                                            {t('actions.confirm_payment')}
                                                        </Button>
                                                    )}
                                                    {booking.status === 'active' && (
                                                        <Button
                                                            size="sm"
                                                            className="h-8 bg-[#4318FF] hover:bg-[#3311cc] text-white rounded-lg px-3 text-[11px] font-bold shadow-sm"
                                                            onClick={() => setActionBooking({ id: booking._id, type: 'checkout' })}
                                                        >
                                                            {t('actions.confirm_checkout')}
                                                        </Button>
                                                    )}
                                                </div>
                                            </TableCell>
                                        )}
                                    </TableRow>
                                );
                            })
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

            <AlertDialog open={!!actionBooking} onOpenChange={(open) => !open && setActionBooking(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {actionBooking?.type === 'confirm' && t('messages.confirm_payment_title')}
                            {actionBooking?.type === 'checkout' && t('messages.confirm_checkout_title')}
                            {actionBooking?.type === 'cancel' && t('messages.cancel_booking_title')}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {actionBooking?.type === 'confirm' && t('messages.confirm_payment_desc')}
                            {actionBooking?.type === 'checkout' && t('messages.confirm_checkout_desc')}
                            {actionBooking?.type === 'cancel' && t('messages.cancel_booking_desc')}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>{t('messages.cancel')}</AlertDialogCancel>
                        <AlertDialogAction
                            className={cn(
                                actionBooking?.type === 'cancel' ? "bg-red-600 hover:bg-red-700" : "bg-[#238C98] hover:bg-[#1d7681]"
                            )}
                            onClick={handleAction}
                        >
                            {t('messages.confirm')}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
