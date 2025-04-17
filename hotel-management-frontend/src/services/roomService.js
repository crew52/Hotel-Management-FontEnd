import axios from "axios";

// Tạo một instance của axios với baseURL (nếu cần)
const apiClient = axios.create({
  baseURL: "http://localhost:8080", // Thay đổi URL này theo cấu hình backend của bạn
  headers: {
    "Content-Type": "application/json",
  },
});

const RoomService = {
  getRoomCategories: async () => {
    try {
      const response = await apiClient.get("/api/room-categories");
      console.log("Response from getRoomCategories:", response.data); // Log để kiểm tra
      return response.data;
    } catch (error) {
      console.error("Error in getRoomCategories:", error.response?.data || error.message);
      throw error;
    }
  },

  getAll: async (page, size) => {
    try {
      const response = await apiClient.get(`/api/rooms?page=${page}&size=${size}`);
      console.log("Response from getAll:", response.data); // Log để kiểm tra
      return response.data;
    } catch (error) {
      console.error("Error in getAll:", error.response?.data || error.message);
      throw error;
    }
  },

  addRoomCategory: async (data) => {
    try {
      console.log("Payload for addRoomCategory:", data); // Log payload
      const response = await apiClient.post("/api/room-categories", data);
      console.log("Response from addRoomCategory:", response.data); // Log để kiểm tra
      return response.data;
    } catch (error) {
      console.error("Error in addRoomCategory:", error.response?.data || error.message);
      throw error;
    }
  },

  updateRoomCategory: async (id, data) => {
    try {
      console.log(`Payload for updateRoomCategory (ID: ${id}):`, data); // Log payload
      const response = await apiClient.put(`/api/room-categories/${id}/edit`, data);
      console.log("Response from updateRoomCategory:", response.data); // Log để kiểm tra
      return response.data;
    } catch (error) {
      console.error("Error in updateRoomCategory:", error.response?.data || error.message);
      throw error;
    }
  },

  addRoom: async (data) => {
    try {
      console.log("Payload for addRoom:", data); // Log payload
      const response = await apiClient.post("/api/rooms", data);
      console.log("Response from addRoom:", response.data); // Log để kiểm tra
      return response.data;
    } catch (error) {
      console.error("Error in addRoom:", error.response?.data || error.message);
      throw error;
    }
  },

  updateRoom: async (id, data) => {
    try {
      console.log(`Payload for updateRoom (ID: ${id}):`, data); // Log payload
      const response = await apiClient.put(`/api/rooms/${id}`, data);
      console.log("Response from updateRoom:", response.data); // Log để kiểm tra
      return response.data;
    } catch (error) {
      console.error("Error in updateRoom:", error.response?.data || error.message);
      throw error;
    }
  },

  deleteRoomCategory: async (id) => {
    try {
      const response = await apiClient.delete(`/api/room-categories/${id}/delete`);
      console.log("Response from deleteRoomCategory:", response.data); // Log để kiểm tra
      return response.data;
    } catch (error) {
      console.error("Error in deleteRoomCategory:", error.response?.data || error.message);
      throw error;
    }
  },

  deleteRoom: async (id) => {
    try {
      const response = await apiClient.delete(`/api/rooms/${id}/delete`);
      console.log("Response from deleteRoom:", response.data); // Log để kiểm tra
      return response.data;
    } catch (error) {
      console.error("Error in deleteRoom:", error.response?.data || error.message);
      throw error;
    }
  },
};

export default RoomService;