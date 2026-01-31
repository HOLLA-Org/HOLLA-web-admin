import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { hotelService } from '@/services/hotel-service';
import { CreateHotelRequest, UpdateHotelRequest } from '@/types/api/request/hotel.request';

/**
 * Query Keys for React Query cache management
 */
export const hotelQueryKeys = {
    all: ['hotels'] as const,
    lists: () => [...hotelQueryKeys.all, 'list'] as const,
    list: (filters: any) => [...hotelQueryKeys.lists(), filters] as const,
    details: () => [...hotelQueryKeys.all, 'detail'] as const,
    detail: (id: string) => [...hotelQueryKeys.details(), id] as const,
};

/**
 * Hook: Get all hotels
 */
// ...

export function useHotels() {
    return useQuery({
        queryKey: hotelQueryKeys.lists(),
        queryFn: () => hotelService.getAllHotels(),
    });
}

/**
 * Hook: Get hotel details
 */
export function useHotelDetails(id: string) {
    return useQuery({
        queryKey: hotelQueryKeys.detail(id),
        queryFn: () => hotelService.getHotelById(id),
        enabled: !!id,
    });
}

/**
 * Hook: Create a hotel
 */
export function useCreateHotel() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: CreateHotelRequest) => hotelService.createHotel(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: hotelQueryKeys.lists() });
        },
    });
}

/**
 * Hook: Update a hotel
 */
export function useUpdateHotel() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: UpdateHotelRequest) => hotelService.updateHotel(payload),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: hotelQueryKeys.lists() });
            queryClient.invalidateQueries({ queryKey: hotelQueryKeys.detail(variables.id) });
        },
    });
}

/**
 * Hook: Delete a hotel
 */
export function useDeleteHotel() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => hotelService.deleteHotel(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: hotelQueryKeys.lists() });
        },
    });
}

/**
 * Hook: Add images to hotel
 */
export function useAddHotelImages() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, imageUrls }: { id: string; imageUrls: string[] }) =>
            hotelService.addImages(id, imageUrls),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: hotelQueryKeys.lists() });
            queryClient.invalidateQueries({ queryKey: hotelQueryKeys.detail(variables.id) });
        },
    });
}

/**
 * Hook: Upload hotel images directly
 */
export function useUploadHotelImages() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, formData }: { id: string; formData: FormData }) =>
            hotelService.uploadImages(id, formData),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: hotelQueryKeys.lists() });
            queryClient.invalidateQueries({ queryKey: hotelQueryKeys.detail(variables.id) });
        },
    });
}

/**
 * Hook: Search hotels
 */
export function useSearchHotels(name: string) {
    return useQuery({
        queryKey: [...hotelQueryKeys.lists(), 'search', name],
        queryFn: () => hotelService.searchHotels(name),
        enabled: !!name,
    });
}
