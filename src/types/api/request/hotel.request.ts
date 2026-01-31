export interface CreateHotelRequest {
    name: string;
    address: string;
    priceHour: number;
    priceDay: number;
    totalRooms: number;
    availableRooms: number;
    rating?: number;
    ratingCount?: number;
    isPopular?: boolean;
    latitude: number;
    longitude: number;
    amenities?: string[];
    images?: string[];
}

export interface UpdateHotelRequest extends Partial<CreateHotelRequest> {
    id: string;
}

export interface SearchHotelRequest {
    name: string;
}
