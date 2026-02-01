import { apiClient } from '../lib/api-client';
import { Booking, BookingListResponse, BookingStatus, UpdateBookingResponse } from '@/types/api/response/booking.response';

export const bookingService = {
    /**
     * Get all bookings
     */
    getAllBookings: async (): Promise<BookingListResponse> => {
        try {
            const response = await apiClient<Booking[]>('bookings', { method: 'GET' });
            return {
                ok: true,
                data: response,
            };
        } catch (error) {
            return {
                ok: false,
                data: [],
                message: error instanceof Error ? error.message : 'Failed to fetch bookings',
            };
        }
    },

    /**
     * Get bookings by status for a user (if needed)
     */
    getAllByStatus: async (user_id: string, status: BookingStatus): Promise<BookingListResponse> => {
        try {
            const response = await apiClient<Booking[]>(`bookings/user/${user_id}/status/${status}`, { method: 'GET' });
            return {
                ok: true,
                data: response,
            };
        } catch (error) {
            return {
                ok: false,
                data: [],
                message: error instanceof Error ? error.message : 'Failed to fetch bookings by status',
            };
        }
    },

    /**
     * Confirm a booking (Admin)
     */
    confirmBooking: async (id: string): Promise<UpdateBookingResponse> => {
        try {
            const response = await apiClient<Booking>(`bookings/confirm/${id}`, { method: 'PATCH' });
            return { ok: true, data: response };
        } catch (error) {
            return { ok: false, data: {} as Booking, message: error instanceof Error ? error.message : 'Failed to confirm booking' };
        }
    },

    /**
     * Cancel a booking (Admin)
     */
    adminCancelBooking: async (id: string): Promise<UpdateBookingResponse> => {
        try {
            const response = await apiClient<Booking>(`bookings/admin/${id}/cancel`, { method: 'PATCH' });
            return { ok: true, data: response };
        } catch (error) {
            return { ok: false, data: {} as Booking, message: error instanceof Error ? error.message : 'Failed to cancel booking' };
        }
    },

    /**
     * Check-out a booking (Admin)
     */
    adminCheckOutBooking: async (id: string): Promise<UpdateBookingResponse> => {
        try {
            const response = await apiClient<Booking>(`bookings/admin/${id}/check-out`, { method: 'PATCH' });
            return { ok: true, data: response };
        } catch (error) {
            return { ok: false, data: {} as Booking, message: error instanceof Error ? error.message : 'Failed to check-out booking' };
        }
    },
};
