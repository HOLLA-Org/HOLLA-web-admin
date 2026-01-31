import { apiClient } from '@/lib/api-client';
import { Amenity } from '@/types/api/response/hotel.response';

export const amenityService = {
    getAll: async (): Promise<{ ok: boolean; data: Amenity[]; message?: string }> => {
        try {
            const response = await apiClient<Amenity[]>('amenities', {
                method: 'GET',
            });
            return {
                ok: true,
                data: response,
            };
        } catch (error: any) {
            return {
                ok: false,
                data: [],
                message: error instanceof Error ? error.message : 'Failed to fetch amenities',
            };
        }
    },
    create: async (payload: { name: string; icon?: string }): Promise<{ ok: boolean; data?: Amenity; message?: string }> => {
        try {
            const response = await apiClient<Amenity>('amenities', {
                method: 'POST',
                data: payload,
            });
            return {
                ok: true,
                data: response,
            };
        } catch (error: any) {
            return {
                ok: false,
                message: error instanceof Error ? error.message : 'Failed to create amenity',
            };
        }
    },
    delete: async (id: string): Promise<{ ok: boolean; message?: string }> => {
        try {
            await apiClient<{ message: string }>(`amenities/${id}`, {
                method: 'DELETE',
            });
            return {
                ok: true,
            };
        } catch (error: any) {
            return {
                ok: false,
                message: error instanceof Error ? error.message : 'Failed to delete amenity',
            };
        }
    },
};
