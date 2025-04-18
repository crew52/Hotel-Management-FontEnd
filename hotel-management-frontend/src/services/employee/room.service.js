import {axiosInstance} from "../../configs/axios.config.js";

class RoomViewService {

    static async getAllRoomView() {
        return await axiosInstance.get("/rooms");
    }


    static async searchRoomView({ keyword = "", status = "", floor = "" }) {
        const query = `/rooms/search?keyword=${keyword}&status=${status}&floor=${floor}`;
        return await axiosInstance.get(query);
    }


}

export default RoomViewService;