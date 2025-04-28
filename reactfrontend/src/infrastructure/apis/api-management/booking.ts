import { BookingApi, Configuration } from '../client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAppSelector } from '@application/store';

/**
 * Hook to get all bookings for the current user
 */
export const useGetMyBookings = () => {
  const { token } = useAppSelector(state => state.profileReducer);
  
  return useQuery({
    queryKey: ['myBookings', token],
    queryFn: async () => {
      if (!token) return null;
      
      const api = new BookingApi(new Configuration({ accessToken: token }));
      const response = await api.getMyBookings();
      return response.response;
    },
    enabled: !!token
  });
};

/**
 * Hook to create a new booking
 */
export const useCreateBooking = () => {
  const { token } = useAppSelector(state => state.profileReducer);
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationKey: ['createBooking', token],
    mutationFn: async (bookingData: {
      startDate: string;
      endDate: string;
      notes?: string;
      sitterId: string;
      petId: string;
    }) => {
      if (!token) throw new Error('Not authenticated');
      
      const api = new BookingApi(new Configuration({ accessToken: token }));
      const response = await api.createBooking(bookingData);
      return response.response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myBookings'] });
    }
  });
};

/**
 * Hook to update a booking
 */
export const useUpdateBooking = () => {
  const { token } = useAppSelector(state => state.profileReducer);
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationKey: ['updateBooking', token],
    mutationFn: async ({ id, ...bookingData }: {
      id: string;
      startDate?: string;
      endDate?: string;
      notes?: string;
      status?: string;
    }) => {
      if (!token) throw new Error('Not authenticated');
      
      const api = new BookingApi(new Configuration({ accessToken: token }));
      const response = await api.updateBooking(id, bookingData);
      return response.response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myBookings'] });
    }
  });
};

/**
 * Hook to delete a booking
 */
export const useDeleteBooking = () => {
  const { token } = useAppSelector(state => state.profileReducer);
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationKey: ['deleteBooking', token],
    mutationFn: async (id: string) => {
      if (!token) throw new Error('Not authenticated');
      
      const api = new BookingApi(new Configuration({ accessToken: token }));
      const response = await api.deleteBooking(id);
      return response.response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myBookings'] });
    }
  });
};