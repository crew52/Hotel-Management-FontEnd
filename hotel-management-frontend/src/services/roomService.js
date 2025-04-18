import api from "./api";

// Service sử dụng API tập trung
const RoomService = {
  getRoomCategories: async () => {
    try {
      const response = await api.getAllRoomCategories();
      console.log("Response from getRoomCategories:", response);
      // Kiểm tra nếu response là object với data
      if (response && response.data) {
        return response.data;
      }
      return response;
    } catch (error) {
      console.error("Error in getRoomCategories:", error.response?.data || error.message);
      throw error;
    }
  },

  getAll: async (page, size) => {
    try {
      const response = await api.getRooms({ page, size });
      console.log("Response from getAll:", response);
      // Kiểm tra nếu response là object với data
      if (response && response.data) {
        return response.data;
      }
      return response;
    } catch (error) {
      console.error("Error in getAll:", error.response?.data || error.message);
      throw error;
    }
  },

  addRoomCategory: async (data) => {
    try {
      console.log("Payload for addRoomCategory:", data);
      const response = await api.addRoomCategory(data);
      console.log("Response from addRoomCategory:", response);
      // Kiểm tra nếu response là object với data
      if (response && response.data) {
        return response.data;
      }
      return response;
    } catch (error) {
      console.error("Error in addRoomCategory:", error.response?.data || error.message);
      throw error;
    }
  },

  updateRoomCategory: async (id, data) => {
    try {
      console.log(`Payload for updateRoomCategory (ID: ${id}):`, data);
      const response = await api.updateRoomCategory(id, data);
      console.log("Response from updateRoomCategory:", response);
      // Kiểm tra nếu response là object với data
      if (response && response.data) {
        return response.data;
      }
      return response;
    } catch (error) {
      console.error("Error in updateRoomCategory:", error.response?.data || error.message);
      throw error;
    }
  },

  addRoom: async (data) => {
    try {
      console.log("Payload for addRoom:", data);
      const response = await api.createRoom(data);
      console.log("Response from addRoom:", response);
      // Kiểm tra nếu response là object với data
      if (response && response.data) {
        return response.data;
      }
      return response;
    } catch (error) {
      console.error("Error in addRoom:", error.response?.data || error.message);
      throw error;
    }
  },

  updateRoom: async (id, data) => {
    try {
      console.log(`Payload for updateRoom (ID: ${id}):`, data);
      const response = await api.updateRoom(id, data);
      console.log("Response from updateRoom:", response);
      // Kiểm tra nếu response là object với data
      if (response && response.data) {
        return response.data;
      }
      return response;
    } catch (error) {
      console.error("Error in updateRoom:", error.response?.data || error.message);
      throw error;
    }
  },

  deleteRoomCategory: async (id) => {
    try {
      const response = await api.deleteRoomCategory(id);
      console.log("Response from deleteRoomCategory:", response);
      // Kiểm tra nếu response là object với data
      if (response && response.data) {
        return response.data;
      }
      return response;
    } catch (error) {
      console.error("Error in deleteRoomCategory:", error.response?.data || error.message);
      throw error;
    }
  },

  deleteRoom: async (id) => {
    try {
      const response = await api.deleteRoom(id);
      console.log("Response from deleteRoom:", response);
      // Kiểm tra nếu response là object với data
      if (response && response.data) {
        return response.data;
      }
      return response;
    } catch (error) {
      console.error("Error in deleteRoom:", error.response?.data || error.message);
      throw error;
    }
  },

  searchRoomCategories: async (params) => {
    try {
      const response = await api.searchRoomCategories(params);
      console.log("Response from searchRoomCategories:", response);
      // Kiểm tra nếu response là object với data
      if (response && response.data) {
        return response.data;
      }
      return response;
    } catch (error) {
      console.error("Error in searchRoomCategories:", error.response?.data || error.message);
      throw error;
    }
  },
  
  // Thêm hàm để lấy room category theo ID
  getRoomCategoryById: async (id) => {
    try {
      const response = await api.getRoomCategoriesById(id);
      console.log(`Response from getRoomCategoryById (ID: ${id}):`, response);
      // Kiểm tra nếu response là object với data
      if (response && response.data) {
        return response.data;
      }
      return response;
    } catch (error) {
      console.error("Error in getRoomCategoryById:", error.response?.data || error.message);
      throw error;
    }
  },
};

export default RoomService;