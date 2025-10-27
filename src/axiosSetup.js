import axios from 'axios';
import store from './store';
import { logoutUser } from './reducers/authSlice';

// Global Axios response interceptor: redirect to login on unauthorized
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error?.response?.status;
    const message = error?.response?.data?.message;

    if (status === 401 || message === 'Unauthorized') {
      try {
        await store.dispatch(logoutUser());
      } catch (_) {
        // ignore
      } finally {
        if (window?.location?.pathname !== '/login') {
          window.location.replace('/login');
        }
      }
    }

    return Promise.reject(error);
  }
);

