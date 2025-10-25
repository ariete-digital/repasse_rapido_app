import { api } from './api';
import { storageAuthTokenGet, storageAuthTokenRemove } from './storage/storageAuthToken';
import { storageUserRemove } from './storage/storageUser';

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

export const setupApiInterceptors = (refreshTokenFn: () => Promise<string | null>, signOutFn: () => Promise<void>) => {
  // Response interceptor to handle expired tokens
  api.interceptors.response.use(
    (response) => {
      // Check if response has status "expired"
      if (response.data && response.data.status === 'expired') {
        console.log('Token expired detected in response');
        
        const originalRequest = response.config as any;

        if (isRefreshing) {
          // If already refreshing, queue this request
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then(token => {
              originalRequest.headers['Authorization'] = `Bearer ${token}`;
              return api(originalRequest);
            })
            .catch(err => {
              return Promise.reject(err);
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        return new Promise((resolve, reject) => {
          refreshTokenFn()
            .then((newToken) => {
              if (newToken) {
                // Token refreshed successfully
                originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
                processQueue(null, newToken);
                resolve(api(originalRequest));
              } else {
                // Refresh failed, logout user
                console.log('Refresh failed, logging out...');
                processQueue(new Error('Token refresh failed'), null);
                signOutFn().then(() => {
                  // Redirect to login will be handled by navigation
                  reject(new Error('Session expired, please login again'));
                });
              }
            })
            .catch((err) => {
              console.error('Error during token refresh:', err);
              processQueue(err, null);
              signOutFn().then(() => {
                reject(err);
              });
            })
            .finally(() => {
              isRefreshing = false;
            });
        });
      }

      return response;
    },
    async (error) => {
      const originalRequest = error.config;

      // Check if error response has status "expired"
      if (error.response?.data?.status === 'expired' && !originalRequest._retry) {
        console.log('Token expired detected in error response');

        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then(token => {
              originalRequest.headers['Authorization'] = `Bearer ${token}`;
              return api(originalRequest);
            })
            .catch(err => {
              return Promise.reject(err);
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        return new Promise((resolve, reject) => {
          refreshTokenFn()
            .then((newToken) => {
              if (newToken) {
                originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
                processQueue(null, newToken);
                resolve(api(originalRequest));
              } else {
                console.log('Refresh failed, logging out...');
                processQueue(new Error('Token refresh failed'), null);
                signOutFn().then(() => {
                  reject(new Error('Session expired, please login again'));
                });
              }
            })
            .catch((err) => {
              console.error('Error during token refresh:', err);
              processQueue(err, null);
              signOutFn().then(() => {
                reject(err);
              });
            })
            .finally(() => {
              isRefreshing = false;
            });
        });
      }

      // Handle 401 unauthorized
      if (error.response?.status === 401) {
        console.log('Unauthorized access - 401');
        // Could also trigger refresh here if needed
      }

      return Promise.reject(error);
    }
  );
};

