export interface Amenity {
    _id: string;
    name: string;
    icon?: string;
}

export interface Hotel {
    _id: string;
    name: string;
    address: string;
    priceHour: number;
    priceDay: number;
    totalRooms: number;
    availableRooms: number;
    rating: number;
    ratingCount: number;
    isPopular: boolean;
    latitude: number;
    longitude: number;
    amenities: Amenity[];
    images: string[];
    isFavorite: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface HotelListResponse {
    ok: boolean;
    data: Hotel[];
    message?: string;
    pagination?: {
        page: number;
        limit: number;
        total: number;
        totalPages?: number;
    };
}

export interface HotelDetailResponse {
    ok: boolean;
    data: Hotel;
    message?: string;
}

export interface CreateHotelResponse {
    ok: boolean;
    data: Hotel;
    message?: string;
}

export interface UpdateHotelResponse {
    ok: boolean;
    data: Hotel;
    message?: string;
}

export interface DeleteHotelResponse {
    ok: boolean;
    message?: string;
}
