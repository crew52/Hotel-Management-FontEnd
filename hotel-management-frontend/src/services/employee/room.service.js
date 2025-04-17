import api from "../api";

class RoomViewService {

    static async getAllRoomView() {
        try {
            const response = await api.getAllRoomView();
            console.log("Response from getAllRoomView:", response);
            
            // Kiểm tra dữ liệu response
            if (response && response.data) {
                return response;
            }
            
            // Wrap response nếu chưa có format chuẩn
            return { 
                data: { 
                    content: Array.isArray(response) ? response : [response],
                    totalElements: Array.isArray(response) ? response.length : 1 
                } 
            };
        } catch (error) {
            console.error("Error in getAllRoomView:", error);
            // Trả về mảng rỗng khi lỗi
            return { data: { content: [], totalElements: 0 } };
        }
    }

    static async searchRoomView({ keyword = "", status = "", floor = "" }) {
        try {
            const response = await api.searchRoomView({ keyword, status, floor });
            console.log("Response from searchRoomView:", response);
            
            // Kiểm tra dữ liệu response
            if (response && response.data) {
                return response;
            }
            
            // Wrap response nếu chưa có format chuẩn
            return { 
                data: { 
                    content: Array.isArray(response) ? response : [response],
                    totalElements: Array.isArray(response) ? response.length : 1 
                } 
            };
        } catch (error) {
            console.error("Error in searchRoomView:", error);
            // Trả về mảng rỗng khi lỗi
            return { data: { content: [], totalElements: 0 } };
        }
    }
}

export default RoomViewService;