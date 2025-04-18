import api from './api';

// Cache configuration
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const apiCache = new Map();

/**
 * Helper function to generate cache key from request config
 */
const getCacheKey = (url, params) => {
  return `GET:${url}:${JSON.stringify(params || {})}`;
};

/**
 * Clear cache for specific endpoints or entirely
 */
const clearCache = (urlPattern) => {
  if (!urlPattern) {
    console.log('Clearing entire API cache');
    apiCache.clear();
    return;
  }
  
  // Clear matching cache entries
  for (const key of apiCache.keys()) {
    if (key.includes(urlPattern)) {
      console.log('Clearing cache for:', urlPattern);
      apiCache.delete(key);
    }
  }
};

/**
 * Get data from cache or fetch from API
 */
const getWithCache = async (url, params, forceFresh = false) => {
  const cacheKey = getCacheKey(url, params);
  
  // Check cache first if not forcing fresh data
  if (!forceFresh) {
    const cachedData = apiCache.get(cacheKey);
    if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
      console.log('Using cached data for:', url);
      return cachedData.data;
    }
  }
  
  // Fetch fresh data
  try {
    const response = await api.axiosInstance.get(url, { params });
    
    // Cache the response
    apiCache.set(cacheKey, {
      data: response.data,
      timestamp: Date.now()
    });
    
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
    throw error;
  }
};

/**
 * Prefetch data for routes that will likely be visited
 */
const prefetchData = async (endpoints) => {
  try {
    const requests = endpoints.map(endpoint => {
      const [url, params] = Array.isArray(endpoint) ? endpoint : [endpoint, {}];
      
      // Only prefetch if not already in cache
      const cacheKey = getCacheKey(url, params);
      const cachedData = apiCache.get(cacheKey);
      
      if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
        console.log('Skipping prefetch for already cached:', url);
        return Promise.resolve(null);
      }
      
      return api.axiosInstance.get(url, { params })
        .then(response => {
          apiCache.set(cacheKey, {
            data: response.data,
            timestamp: Date.now()
          });
          console.log('Prefetched data for:', url);
          return response.data;
        })
        .catch(err => {
          console.error(`Failed to prefetch ${url}:`, err);
          return null;
        });
    });
    
    await Promise.all(requests);
  } catch (error) {
    console.error('Error during data prefetching:', error);
  }
};

/**
 * Invalidate cache after mutations (POST, PUT, DELETE)
 */
const invalidateRelatedCache = (urlPatterns) => {
  if (!urlPatterns || !urlPatterns.length) return;
  
  urlPatterns.forEach(pattern => clearCache(pattern));
};

/**
 * Post data and invalidate related cache
 */
const postWithCacheInvalidation = async (url, data, invalidatePatterns = []) => {
  try {
    const response = await api.axiosInstance.post(url, data);
    invalidateRelatedCache(invalidatePatterns);
    return response.data;
  } catch (error) {
    console.error(`Error posting to ${url}:`, error);
    throw error;
  }
};

/**
 * Put data and invalidate related cache
 */
const putWithCacheInvalidation = async (url, data, invalidatePatterns = []) => {
  try {
    const response = await api.axiosInstance.put(url, data);
    invalidateRelatedCache(invalidatePatterns);
    return response.data;
  } catch (error) {
    console.error(`Error putting to ${url}:`, error);
    throw error;
  }
};

/**
 * Delete data and invalidate related cache
 */
const deleteWithCacheInvalidation = async (url, invalidatePatterns = []) => {
  try {
    const response = await api.axiosInstance.delete(url);
    invalidateRelatedCache(invalidatePatterns);
    return response.data;
  } catch (error) {
    console.error(`Error deleting ${url}:`, error);
    throw error;
  }
};

const spaApi = {
  // Cache methods
  getWithCache,
  clearCache,
  prefetchData,
  
  // Mutation methods with cache invalidation
  post: postWithCacheInvalidation,
  put: putWithCacheInvalidation,
  delete: deleteWithCacheInvalidation,
  
  // Authentication actions from original API
  login: async (credentials) => {
    clearCache(); // Clear all cache on login
    return api.login(credentials);
  },
  
  logout: () => {
    clearCache(); // Clear all cache on logout
    return api.logout();
  },
  
  // Original API reference
  api
};

export default spaApi; 