import { SitterProfileApi, Configuration } from '../client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAppSelector } from '@application/store';

/**
 * Hook to get all sitters
 */
export const useGetAllSitters = () => {
  const { token } = useAppSelector(state => state.profileReducer);
  
  return useQuery({
    queryKey: ['allSitters', token],
    queryFn: async () => {
      if (!token) return null;
      
      const api = new SitterProfileApi(new Configuration({ accessToken: token }));
      const response = await api.getAllSitters();
      return response.response;
    },
    enabled: !!token
  });
};

/**
 * Hook to get a sitter profile by ID
 */
export const useGetSitterProfile = (id: string | undefined) => {
  const { token } = useAppSelector(state => state.profileReducer);
  
  return useQuery({
    queryKey: ['sitterProfile', id, token],
    queryFn: async () => {
      if (!token || !id) return null;
      
      const api = new SitterProfileApi(new Configuration({ accessToken: token }));
      const response = await api.getProfileById(id);
      return response.response;
    },
    enabled: !!token && !!id
  });
};

/**
 * Hook to get the current sitter's profile
 */
export const useGetMyProfile = () => {
  const { token, role } = useAppSelector(state => state.profileReducer);
  
  return useQuery({
    queryKey: ['myProfile', token],
    queryFn: async () => {
      if (!token || role !== 'Sitter') return null;
      
      const api = new SitterProfileApi(new Configuration({ accessToken: token }));
      try {
        const response = await api.getMyProfile();
        return response.response;
      } catch (error) {
        // Profile might not exist yet, which is fine
        if (error.message.includes('EntityNotFound')) {
          return null;
        }
        throw error;
      }
    },
    enabled: !!token && role === 'Sitter'
  });
};

/**
 * Hook to add a new sitter profile
 */
export const useAddSitterProfile = () => {
  const { token } = useAppSelector(state => state.profileReducer);
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationKey: ['addSitterProfile', token],
    mutationFn: async (profileData: {
      bio: string;
      yearsExperience: number;
      hourlyRate: number;
      location: string;
    }) => {
      if (!token) throw new Error('Not authenticated');
      
      const api = new SitterProfileApi(new Configuration({ accessToken: token }));
      const response = await api.addProfile(profileData);
      return response.response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myProfile'] });
    }
  });
};

/**
 * Hook to update a sitter profile
 */
export const useUpdateSitterProfile = () => {
  const { token } = useAppSelector(state => state.profileReducer);
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationKey: ['updateSitterProfile', token],
    mutationFn: async (profileData: {
      bio: string;
      yearsExperience: number;
      hourlyRate: number;
      location: string;
    }) => {
      if (!token) throw new Error('Not authenticated');
      
      const api = new SitterProfileApi(new Configuration({ accessToken: token }));
      const response = await api.updateProfile(profileData);
      return response.response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myProfile'] });
    }
  });
};