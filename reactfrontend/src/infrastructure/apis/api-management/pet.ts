import { PetApi, Configuration } from '../client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAppSelector } from '@application/store';

/**
 * Hook to get all pets for the current user
 */
export const useGetMyPets = () => {
  const { token } = useAppSelector(state => state.profileReducer);
  
  return useQuery({
    queryKey: ['myPets', token],
    queryFn: async () => {
      if (!token) return null;
      
      const api = new PetApi(new Configuration({ accessToken: token }));
      const response = await api.getMyPets();
      return response.response;
    },
    enabled: !!token
  });
};

/**
 * Hook to add a new pet
 */
export const useAddPet = () => {
  const { token } = useAppSelector(state => state.profileReducer);
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationKey: ['addPet', token],
    mutationFn: async (petData: { name: string; type: string; breed: string; age: number }) => {
      if (!token) throw new Error('Not authenticated');
      
      const api = new PetApi(new Configuration({ accessToken: token }));
      const response = await api.addPet(petData);
      return response.response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myPets'] });
    }
  });
};

/**
 * Hook to update a pet
 */
export const useUpdatePet = () => {
  const { token } = useAppSelector(state => state.profileReducer);
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationKey: ['updatePet', token],
    mutationFn: async ({ id, ...petData }: { 
      id: string; 
      name: string; 
      type: string; 
      breed: string; 
      age: number 
    }) => {
      if (!token) throw new Error('Not authenticated');
      
      const api = new PetApi(new Configuration({ accessToken: token }));
      const response = await api.updatePet(id, petData);
      return response.response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myPets'] });
    }
  });
};

/**
 * Hook to delete a pet
 */
export const useDeletePet = () => {
  const { token } = useAppSelector(state => state.profileReducer);
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationKey: ['deletePet', token],
    mutationFn: async (id: string) => {
      if (!token) throw new Error('Not authenticated');
      
      const api = new PetApi(new Configuration({ accessToken: token }));
      const response = await api.deletePet(id);
      return response.response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myPets'] });
    }
  });
};