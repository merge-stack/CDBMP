import { useState, useCallback } from 'react';
import { toast } from 'react-toastify';

const useApi = (apiMethod) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const execute = useCallback(
    async (...args) => {
      try {
        setError(null);
        const response = await apiMethod(...args);
        setData(response.data);
        return response.data;
      } catch (err) {
        const errorMessage = err.response?.data?.message || 'An error occurred';
        setError(errorMessage);
        toast.error(errorMessage);
        throw err;
      }
    },
    [apiMethod]
  );

  return {
    data,
    error,
    execute,
  };
};

export default useApi;
