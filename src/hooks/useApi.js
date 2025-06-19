import { useState, useCallback } from 'react';
import { toast } from 'react-toastify';

export const useApi = (apiMethod) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(
    async (...args) => {
      try {
        setLoading(true);
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
        setLoading(false);
      }
    },
    [apiMethod]
  );

  return {
    data,
    loading,
    error,
    execute,
  };
};

export default useApi;
