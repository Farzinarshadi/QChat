import axios from "axios";

// base url
export const API_URL = "http://127.0.0.1:8000";


// axios config
export const publicApi = axios.create({
  baseURL: API_URL,
});

export const privateApi = axios.create({
  baseURL: API_URL,
});

privateApi.interceptors.request.use(
  (config) => {
    const access = localStorage.getItem("access");
    if (access) {
      config.headers["Authorization"] = `Bearer ${access}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

privateApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refresh = localStorage.getItem("refresh");
      if (refresh) {
        try {
          const res = await publicApi.post('/token/refresh/', { refresh });
          localStorage.setItem("access", res.data.access);

          originalRequest.headers["Authorization"] = `Bearer ${res.data.access}`;

          return privateApi(originalRequest);
        } catch (err) {
          localStorage.removeItem("access");
          localStorage.removeItem("refresh");
          window.location.href = '/signin';
        }
      }
    }

    return Promise.reject(error);
  }
);
