import { useState, useEffect, useCallback } from 'react';
import spaApi from '../services/spaApiService';

/**
 * Custom hook for accessing the SPA-optimized API
 * Provides caching, loading state, and error handling
 */
export const useSpaApi = (endpoint, params, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { 
    enabled = true,
    forceFresh = false,
    dependencies = [],
    onSuccess,
    onError
  } = options;
  
  const fetchData = useCallback(async () => {
    if (!enabled) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await spaApi.getWithCache(endpoint, params, forceFresh);
      setData(result);
      setLoading(false);
      
      if (onSuccess) {
        onSuccess(result);
      }
    } catch (err) {
      console.error(`Error fetching data from ${endpoint}:`, err);
      setError(err);
      setLoading(false);
      
      if (onError) {
        onError(err);
      }
    }
  }, [endpoint, JSON.stringify(params), enabled, forceFresh, onSuccess, onError, ...dependencies]);
  
  // Fetch data on mount and when dependencies change
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  
  // Methods for manual control
  const refetch = useCallback(() => fetchData(), [fetchData]);
  
  const invalidateCache = useCallback(() => {
    spaApi.clearCache(endpoint);
  }, [endpoint]);
  
  // Methods for data mutations
  const postData = useCallback(async (postData, invalidatePatterns = [endpoint]) => {
    return spaApi.post(endpoint, postData, invalidatePatterns);
  }, [endpoint]);
  
  const putData = useCallback(async (putData, invalidatePatterns = [endpoint]) => {
    return spaApi.put(endpoint, putData, invalidatePatterns);
  }, [endpoint]);
  
  const deleteData = useCallback(async (invalidatePatterns = [endpoint]) => {
    return spaApi.delete(endpoint, invalidatePatterns);
  }, [endpoint]);
  
  return {
    data,
    loading,
    error,
    refetch,
    invalidateCache,
    postData,
    putData,
    deleteData
  };
};

/**
 * Hook for prefetching data for routes that will likely be visited
 */
export const usePrefetch = () => {
  const prefetch = useCallback((endpoints) => {
    spaApi.prefetchData(endpoints);
  }, []);
  
  return prefetch;
};

export default useSpaApi; 