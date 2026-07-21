import axios from "axios";

export const baseApiProvider = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

baseApiProvider.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status ?? null;

      if (status === 500) {
        console.error("Internal server error:", error.response?.data);
      } else if (!error.response) {
        console.error("Network error:", error.message);
      }
    }

    // Let the caller/UI decide how to handle the error (including 401s).
    return Promise.reject(error);
  },
);
