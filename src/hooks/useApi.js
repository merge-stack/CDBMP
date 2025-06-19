import { useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import useUIStore from '../store/useUIStore';

export const useApi = (apiMethod) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  // Store States
  const { setIsLoading } = useUIStore();

  const execute = useCallback(
    async (...args) => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await apiMethod(...args);
        setData(response.data);
        return response.data;
      } catch (err) {
        const errorMessage = err.response?.data?.message || 'An error occurred';
        setError(errorMessage);
        toast.error(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [apiMethod, setIsLoading]
  );

  return {
    data,
    error,
    execute,
  };
};

export default useApi;
