import { useAppDispatch } from '@application/store';
import { setToken, setUser } from '@application/state-slices';
import { AuthorizationApi } from '../client';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { useIntl } from 'react-intl';

/**
 * Hook to handle user login functionality
 */
export const useLogin = () => {
  const dispatch = useAppDispatch();
  const { formatMessage } = useIntl();
  
  return useMutation({
    mutationKey: ['login'],
    mutationFn: async (credentials: { email: string; password: string }) => {
      const api = new AuthorizationApi();
      const response = await api.login(credentials);
      
      if (response.response) {
        dispatch(setToken(response.response.token));
        dispatch(setUser(response.response.user));
        toast.success(formatMessage({ id: 'auth.loginSuccess' }));
        return response.response;
      }
      
      throw new Error(response.errorMessage?.message || 'Login failed');
    }
  });
};

/**
 * Hook to handle user registration functionality
 */
export const useRegister = () => {
  const dispatch = useAppDispatch();
  const { formatMessage } = useIntl();
  
  return useMutation({
    mutationKey: ['register'],
    mutationFn: async (userData: { 
      name: string; 
      email: string; 
      password: string; 
      phone: string; 
      role: string 
    }) => {
      const api = new AuthorizationApi();
      const response = await api.register(userData);
      
      if (response.response) {
        dispatch(setToken(response.response.token));
        dispatch(setUser(response.response.user));
        toast.success(formatMessage({ id: 'auth.registerSuccess' }));
        return response.response;
      }
      
      throw new Error(response.errorMessage?.message || 'Registration failed');
    }
  });
};