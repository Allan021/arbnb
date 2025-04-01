import axios from "axios";
import { Property } from "@/models/Property";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// Configurar instancia de axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para añadir token de autenticación
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const userInfo = localStorage.getItem("userInfo");
      if (userInfo) {
        const { token } = JSON.parse(userInfo);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Servicios de autenticación
export const authService = {
  login: async (email, password) => {
    const response = await api.post("/users/login", { email, password });
    if (response.data) {
      localStorage.setItem("userInfo", JSON.stringify(response.data));
    }
    return response.data;
  },

  register: async (name, email, password) => {
    const response = await api.post("/users", { name, email, password });
    if (response.data) {
      localStorage.setItem("userInfo", JSON.stringify(response.data));
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem("userInfo");
  },

  getCurrentUser: () => {
    if (typeof window !== "undefined") {
      const userInfo = localStorage.getItem("userInfo");
      return userInfo ? JSON.parse(userInfo) : null;
    }
    return null;
  },

  updateProfile: async (userData) => {
    const response = await api.put("/users/profile", userData);
    if (response.data) {
      localStorage.setItem("userInfo", JSON.stringify(response.data));
    }
    return response.data;
  },
};

// Servicios de propiedades
export const propertyService = {
  getProperties: async (page = 1, keyword = "") => {
    const response = await api.get(
      `/properties?pageNumber=${page}&keyword=${keyword}`
    );
    return response.data;
  },

  getPropertyById: async (id) => {
    const response = await api.get(`/properties/${id}`);
    return response.data;
  },

  createProperty: async (propertyData) => {
    const response = await api.post("/properties", propertyData);
    return response.data;
  },

  updateProperty: async (id, propertyData) => {
    const response = await api.put(`/properties/${id}`, propertyData);
    return response.data;
  },

  deleteProperty: async (id) => {
    const response = await api.delete(`/properties/${id}`);
    return response.data;
  },

  searchProperties: async (searchParams) => {
    const response = await api.get("/search", { params: searchParams });
    return response.data;
  },
};

// Servicios de reservas
export const bookingService = {
  createBooking: async (bookingData) => {
    const response = await api.post("/bookings", bookingData);
    return response.data;
  },

  getMyBookings: async () => {
    const response = await api.get("/bookings");
    return response.data;
  },

  getBookingById: async (id) => {
    const response = await api.get(`/bookings/${id}`);
    return response.data;
  },

  updateBookingStatus: async (id, status) => {
    const response = await api.put(`/bookings/${id}`, { status });
    return response.data;
  },

  updateBookingToPaid: async (id) => {
    const response = await api.put(`/bookings/${id}/pay`);
    return response.data;
  },
};

// Servicios de reseñas
export const reviewService = {
  createReview: async (propertyId, reviewData) => {
    const response = await api.post(
      `/properties/${propertyId}/reviews`,
      reviewData
    );
    return response.data;
  },

  getPropertyReviews: async (propertyId) => {
    const response = await api.get(`/properties/${propertyId}/reviews`);
    return response.data;
  },

  deleteReview: async (id) => {
    const response = await api.delete(`/reviews/${id}`);
    return response.data;
  },
};

export default api;
