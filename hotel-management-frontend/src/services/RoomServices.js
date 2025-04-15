import axios from "axios";

const API_URL = "http://localhost:3000";

const RoomService = {
    getRoomCategories: async () => {
        const response = await axios.get(`${API_URL}/Room_Category`);
        return response.data;
    },

    getRooms: async () => {
        const response = await axios.get(`${API_URL}/Rooms`);
        return response.data;
    },

    addRoomCategory: async (data) => {
        const response = await axios.post(`${API_URL}/Room_Category`, data);
        return response;
    },

    updateRoomCategory: async (uniqueId, data) => {
        const response = await axios.put(`${API_URL}/Room_Category/${uniqueId}`, data);
        return response;
    },

    deleteRoomCategory: async (uniqueId) => {
        const response = await axios.delete(`${API_URL}/Room_Category/${uniqueId}`);
        return response;
    },

    addRoom: async (data) => {
        const response = await axios.post(`${API_URL}/Rooms`, data);
        return response;
    },

    updateRoom: async (uniqueId, data) => {
        const response = await axios.put(`${API_URL}/Rooms/${uniqueId}`, data);
        return response;
    },

    deleteRoom: async (uniqueId) => {
        const response = await axios.delete(`${API_URL}/Rooms/${uniqueId}`);
        return response;
    },
};

export default RoomService;