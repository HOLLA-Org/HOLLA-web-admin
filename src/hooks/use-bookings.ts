import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bookingService } from '@/services/booking-service';

export const bookingQueryKeys = {
    all: ['bookings'] as const,
    lists: () => [...bookingQueryKeys.all, 'list'] as const,
    list: (filters: any) => [...bookingQueryKeys.lists(), filters] as const,
};

export function useBookings() {
    return useQuery({
        queryKey: bookingQueryKeys.lists(),
        queryFn: () => bookingService.getAllBookings(),
    });
}

export function useConfirmBooking() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => bookingService.confirmBooking(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: bookingQueryKeys.lists() });
        },
    });
}

export function useAdminCancelBooking() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => bookingService.adminCancelBooking(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: bookingQueryKeys.lists() });
        },
    });
}

export function useAdminCheckOutBooking() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => bookingService.adminCheckOutBooking(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: bookingQueryKeys.lists() });
        },
    });
}
