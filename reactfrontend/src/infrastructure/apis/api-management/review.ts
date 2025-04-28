import { ReviewApi, Configuration } from '../client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAppSelector } from '@application/store';

/**
 * Hook to get reviews for a sitter
 */
export const useGetSitterReviews = (sitterId: string | undefined) => {
  const { token } = useAppSelector(state => state.profileReducer);
  
  return useQuery({
    queryKey: ['sitterReviews', sitterId, token],
    queryFn: async () => {
      if (!token || !sitterId) return null;
      
      const api = new ReviewApi(new Configuration({ accessToken: token }));
      const response = await api.getForSitter(sitterId);
      return response.response;
    },
    enabled: !!token && !!sitterId
  });
};

/**
 * Hook to get a review for a specific booking
 */
export const useGetBookingReview = (bookingId: string | undefined) => {
  const { token } = useAppSelector(state => state.profileReducer);
  
  return useQuery({
    queryKey: ['bookingReview', bookingId, token],
    queryFn: async () => {
      if (!token || !bookingId) return null;
      
      try {
        const api = new ReviewApi(new Configuration({ accessToken: token }));
        const response = await api.getByBooking(bookingId);
        return response.response;
      } catch (error) {
        // Review might not exist yet, which is fine
        if (error.message.includes('EntityNotFound')) {
          return null;
        }
        throw error;
      }
    },
    enabled: !!token && !!bookingId
  });
};

/**
 * Hook to add a new review
 */
export const useAddReview = () => {
  const { token } = useAppSelector(state => state.profileReducer);
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationKey: ['addReview', token],
    mutationFn: async (reviewData: {
      rating: number;
      comment: string;
      sitterId: string;
      bookingId: string;
    }) => {
      if (!token) throw new Error('Not authenticated');
      
      const api = new ReviewApi(new Configuration({ accessToken: token }));
      const response = await api.addReview(reviewData);
      return response.response;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['sitterReviews', variables.sitterId] });
      queryClient.invalidateQueries({ queryKey: ['bookingReview', variables.bookingId] });
    }
  });
};

/**
 * Hook to update a review
 */
export const useUpdateReview = () => {
  const { token } = useAppSelector(state => state.profileReducer);
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationKey: ['updateReview', token],
    mutationFn: async ({ id, sitterId, bookingId, ...reviewData }: {
      id: string;
      sitterId: string;
      bookingId: string;
      rating: number;
      comment: string;
    }) => {
      if (!token) throw new Error('Not authenticated');
      
      const api = new ReviewApi(new Configuration({ accessToken: token }));
      const response = await api.updateReview(id, reviewData);
      return response.response;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['sitterReviews', variables.sitterId] });
      queryClient.invalidateQueries({ queryKey: ['bookingReview', variables.bookingId] });
    }
  });
};