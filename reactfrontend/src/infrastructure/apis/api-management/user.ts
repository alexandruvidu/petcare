import { UserApi, Configuration } from '../client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAppSelector } from '@application/store';

/**
 * Hook to get the current user's profile
 */
export const useGetCurrentUser = () => {
  const { token } = useAppSelector(state => state.profileReducer);
  
  return useQuery({
    queryKey: ['currentUser', token],
    queryFn: async () => {
      if (!token) return null;
      
      const api = new UserApi(new Configuration({ accessToken: token }));
      const response = await api.getCurrentUser();
      return response.response;
    },
    enabled: !!token
  });
};

/**
 * Hook to update user profile
 */
export const useUpdateUser = () => {
  const { token } = useAppSelector(state => state.profileReducer);
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationKey: ['updateUser', token],
    mutationFn: async (userData: { name?: string; password?: string }) => {
      if (!token) throw new Error('Not authenticated');
      
      const api = new UserApi(new Configuration({ accessToken: token }));
      const response = await api.updateUser(userData);
      return response.response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    }
  });
};