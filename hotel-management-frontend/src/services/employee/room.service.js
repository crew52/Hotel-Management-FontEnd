import {axiosInstance} from "../../configs/axios.config.js";

class RoomViewService {

    static async getAllRoomView() {
        return await axiosInstance.get("/rooms");
    }


    static async searchRoomView({ keyword = "", status = "", floor = "" }) {
        const params = new URLSearchParams();

        if (keyword) params.append("keyword", keyword);
        if (status) params.append("status", status);
        if (floor) params.append("floor", floor);

        return await axiosInstance.get(`/rooms/search?${params.toString()}`);
    }


}

export default RoomViewService;