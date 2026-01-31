import { apiClient } from '../lib/api-client';
import {
    CreateHotelRequest,
    UpdateHotelRequest,
    SearchHotelRequest,
} from '@/types/api/request/hotel.request';
import {
    Hotel,
    HotelListResponse,
    HotelDetailResponse,
    CreateHotelResponse,
    UpdateHotelResponse,
    DeleteHotelResponse,
} from '@/types/api/response/hotel.response';

export const hotelService = {
    /**
     * Get all hotels
     */
    getAllHotels: async (): Promise<HotelListResponse> => {
        try {
            const response = await apiClient<Hotel[]>('hotel', {
                method: 'GET',
            });
            return {
                ok: true,
                data: response,
            };
        } catch (error) {
            return {
                ok: false,
                data: [],
                message: error instanceof Error ? error.message : 'Failed to fetch hotels',
            };
        }
    },

    /**
     * Get popular hotels
     */
    getPopularHotels: async (): Promise<HotelListResponse> => {
        try {
            const response = await apiClient<Hotel[]>('hotel/popular', {
                method: 'GET',
            });
            return {
                ok: true,
                data: response,
            };
        } catch (error) {
            return {
                ok: false,
                data: [],
                message: error instanceof Error ? error.message : 'Failed to fetch popular hotels',
            };
        }
    },

    /**
     * Get hotel by ID
     */
    getHotelById: async (id: string): Promise<HotelDetailResponse> => {
        try {
            const response = await apiClient<Hotel>(`hotel/detail/${id}`, {
                method: 'GET',
            });
            return {
                ok: true,
                data: response,
            };
        } catch (error) {
            return {
                ok: false,
                data: {} as Hotel,
                message: error instanceof Error ? error.message : 'Failed to fetch hotel details',
            };
        }
    },

    /**
     * Create a new hotel
     */
    createHotel: async (payload: CreateHotelRequest): Promise<CreateHotelResponse> => {
        try {
            const response = await apiClient<Hotel>('hotel', {
                method: 'POST',
                data: payload,
            });
            return {
                ok: true,
                data: response,
            };
        } catch (error) {
            return {
                ok: false,
                data: {} as Hotel,
                message: error instanceof Error ? error.message : 'Failed to create hotel',
            };
        }
    },

    /**
     * Update an existing hotel
     */
    updateHotel: async (payload: UpdateHotelRequest): Promise<UpdateHotelResponse> => {
        const { id, ...data } = payload;
        try {
            const response = await apiClient<Hotel>(`hotel/${id}`, {
                method: 'PATCH',
                data,
            });
            return {
                ok: true,
                data: response,
            };
        } catch (error) {
            return {
                ok: false,
                data: {} as Hotel,
                message: error instanceof Error ? error.message : 'Failed to update hotel',
            };
        }
    },

    /**
     * Delete a hotel
     */
    deleteHotel: async (id: string): Promise<DeleteHotelResponse> => {
        try {
            await apiClient<void>(`hotel/${id}`, {
                method: 'DELETE',
            });
            return {
                ok: true,
            };
        } catch (error) {
            return {
                ok: false,
                message: error instanceof Error ? error.message : 'Failed to delete hotel',
            };
        }
    },

    /**
     * Search hotels by name
     */
    searchHotels: async (name: string): Promise<HotelListResponse> => {
        try {
            const response = await apiClient<Hotel[]>(`hotel/search?name=${name}`, {
                method: 'GET',
            });
            return {
                ok: true,
                data: response,
            };
        } catch (error) {
            return {
                ok: false,
                data: [],
                message: error instanceof Error ? error.message : 'Failed to search hotels',
            };
        }
    },

    /**
     * Add images to hotel
     */
    addImages: async (id: string, imageUrls: string[]): Promise<UpdateHotelResponse> => {
        try {
            const response = await apiClient<Hotel>(`hotel/${id}/images`, {
                method: 'POST',
                data: { imageUrls },
            });
            return {
                ok: true,
                data: response,
            };
        } catch (error) {
            return {
                ok: false,
                data: {} as Hotel,
                message: error instanceof Error ? error.message : 'Failed to add images',
            };
        }
    },

    /**
     * Upload images to hotel
     */
    uploadImages: async (id: string, formData: FormData): Promise<UpdateHotelResponse> => {
        try {
            const response = await apiClient<Hotel>(`hotel/${id}/images/upload`, {
                method: 'POST',
                data: formData,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return {
                ok: true,
                data: response,
            };
        } catch (error) {
            return {
                ok: false,
                data: {} as Hotel,
                message: error instanceof Error ? error.message : 'Failed to upload images',
            };
        }
    },

    /**
     * Get all amenities
     */
    getAmenities: async (): Promise<{ ok: boolean, data: any[] }> => {
        try {
            const response = await apiClient<any[]>('amenity', {
                method: 'GET',
            });
            return {
                ok: true,
                data: response,
            };
        } catch (error) {
            return {
                ok: false,
                data: [],
            };
        }
    },
};
