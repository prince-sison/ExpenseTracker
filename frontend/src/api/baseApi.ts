import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response ? error.response.status : null;

    if (status === 401) {
      // Handle unauthorized error, e.g., redirect to login
      window.location.href = "/login"; // Redirect to login page
    } else if (status === 500) {
      // Handle internal server error
      console.error(
        "Internal server error:",
        error.response ? error.response.data : error.message,
      );
    } else if (!error.response) {
      console.error("Network error:", error.message);
    }

    return Promise.reject(error);
  },
);
