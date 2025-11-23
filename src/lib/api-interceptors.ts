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
  
  api.interceptors.response.use(
    (response) => {
      
      if (response.data && response.data.status === 'expired') {
        
        const originalRequest = response.config as any;

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
                
                processQueue(new Error('Token refresh failed'), null);
                signOutFn().then(() => {
                  
                  reject(new Error('Session expired, please login again'));
                });
              }
            })
            .catch((err) => {
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

      if (error.response?.data?.status === 'expired' && !originalRequest._retry) {

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
                processQueue(new Error('Token refresh failed'), null);
                signOutFn().then(() => {
                  reject(new Error('Session expired, please login again'));
                });
              }
            })
            .catch((err) => {
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

      if (error.response?.status === 401) {
        
      }

      return Promise.reject(error);
    }
  );
};

