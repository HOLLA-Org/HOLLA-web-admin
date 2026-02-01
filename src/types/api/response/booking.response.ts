import { User } from '@/types/entities/user.entity';
import { Hotel } from './hotel.response';

export type BookingStatus = 'pending' | 'active' | 'completed' | 'cancelled';

export interface Booking {
    _id: string;
    user_id: User;
    hotel_id: Hotel;
    check_in: string;
    check_out: string;
    booking_type: 'per_hour' | 'per_day';
    total_price: number;
    status: BookingStatus;
    expires_at: string;
    paid_amount?: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface BookingListResponse {
    ok: boolean;
    data: Booking[];
    message?: string;
    pagination?: {
        page: number;
        limit: number;
        total: number;
        totalPages?: number;
    };
}

export interface UpdateBookingResponse {
    ok: boolean;
    data: Booking;
    message?: string;
}
